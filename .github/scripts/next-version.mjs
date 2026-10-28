// Resolves the version for the next prerelease from what is actually published, not from package.json on disk.
//
// 1. Backfills git tags for `-next.N` versions that are on npm but missing in git (a run that published but never
//    pushed), using the source commit from each version's provenance attestation.
// 2. Picks the highest `-next.N` above the latest stable major across npm and git, and bumps N;
//    with none, opens the line at `<stable major + 1>.0.0-next.0`.
//
// Usage: node .github/scripts/next-version.mjs [--dry-run]
// Writes `version=<x>` and `backfilled=<tags>` to $GITHUB_OUTPUT when set.

import { execFileSync } from "node:child_process";
import { appendFileSync, readdirSync, readFileSync } from "node:fs";

const PREID = "next";
const dryRun = process.argv.includes("--dry-run");

const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();
const tryGit = (...args) => {
  try {
    git(...args);
    return true;
  } catch {
    return false;
  }
};

const parse = version => {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+)\.(\d+))?$/.exec(version);
  if (!match) return undefined;
  const [, major, minor, patch, preid, pre] = match;
  return { version, major: +major, minor: +minor, patch: +patch, preid, pre: pre === undefined ? undefined : +pre };
};
const compare = (a, b) =>
  a.major - b.major || a.minor - b.minor || a.patch - b.patch || (a.pre ?? Infinity) - (b.pre ?? Infinity);
const max = versions => versions.reduce((top, v) => (top && compare(top, v) >= 0 ? top : v), undefined);

const packages = readdirSync("packages")
  .map(dir => JSON.parse(readFileSync(`packages/${dir}/package.json`, "utf8")))
  .filter(pkg => !pkg.private);

const registry = "https://registry.npmjs.org";
const fetchJson = async url => {
  const res = await fetch(url);
  if (res.status === 404) return undefined;
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
  return res.json();
};
const encode = name => name.replace("/", "%2f");

/** Source commit recorded in the version's SLSA provenance, if any. */
const provenanceCommit = async (name, version) => {
  const body = await fetchJson(`${registry}/-/npm/v1/attestations/${encode(name)}@${version}`);
  for (const attestation of body?.attestations ?? []) {
    const payload = attestation.bundle?.dsseEnvelope?.payload;
    if (!payload) continue;
    const statement = JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
    const commit = statement.predicate?.buildDefinition?.resolvedDependencies?.[0]?.digest?.gitCommit;
    if (commit) return commit;
  }
  return undefined;
};

const candidates = [];
const backfilled = [];

for (const { name } of packages) {
  const doc = await fetchJson(`${registry}/${encode(name)}`);
  const published = Object.keys(doc?.versions ?? {})
    .map(parse)
    .filter(Boolean);
  const tagged = git("tag", "--list", `${name}@*`)
    .split("\n")
    .filter(Boolean)
    .map(tag => parse(tag.slice(name.length + 1)))
    .filter(Boolean);
  const taggedVersions = new Set(tagged.map(v => v.version));

  for (const v of published) {
    if (v.preid !== PREID || taggedVersions.has(v.version)) continue;
    const tag = `${name}@${v.version}`;
    const commit = await provenanceCommit(name, v.version);
    if (!commit || !tryGit("merge-base", "--is-ancestor", commit, "HEAD")) {
      console.log(`::warning::${tag} is on npm but its source commit is not on this branch; not tagging it`);
      continue;
    }
    if (!dryRun) git("tag", "--annotate", tag, "--message", tag, commit);
    console.log(`Backfilled ${tag} → ${commit.slice(0, 7)}`);
    backfilled.push(tag);
  }

  candidates.push(...published, ...tagged);
}

const stableMajor = max(candidates.filter(v => v.pre === undefined))?.major ?? 0;
const current = max(candidates.filter(v => v.preid === PREID && v.major > stableMajor));
const version = current
  ? `${current.major}.${current.minor}.${current.patch}-${PREID}.${current.pre + 1}`
  : `${stableMajor + 1}.0.0-${PREID}.0`;

console.log(
  `Latest stable major: ${stableMajor}; current ${PREID}: ${current?.version ?? "none"}; releasing ${version}`
);

if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `version=${version}\nbackfilled=${backfilled.join(" ")}\n`);
}
