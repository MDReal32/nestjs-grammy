import type { MatcherResult } from "./matcher-result";

export type MatcherFunction = (received: unknown, ...expected: readonly unknown[]) => MatcherResult;
