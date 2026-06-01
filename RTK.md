# RTK - Runtime Tactical Kernel

## Purpose

This file is the short operational contract for agents working in this repository. Keep changes scoped, inspect the relevant code before editing, and prefer the project's existing NestJS and TypeScript patterns.

## Source of Truth

Read these first when planning or implementing:

- `README.md` - project behavior and usage.
- `package.json` - scripts, dependencies, and package boundaries.
- `RULES.md` - repository governance, code style, and module boundaries.
- `packages/nestjs-grammy/src/` - publishable library source.
- `tests/` - existing test patterns.
- `.planning/AGENT_RULES.md` - agent workflow and verification discipline.
- `.planning/DOC_STANDARDS.md` - documentation layer expectations.
- `.planning/runbooks/TASK_PLAYBOOKS.md` - reusable task checklists.

## Codebase Rules

- Inspect existing code before deleting or reusing it.
- Reuse local modules, providers, decorators, and test patterns before adding new abstractions.
- Prefer small, explicit modules with clear ownership.
- Keep Telegram, config, persistence, and external API boundaries explicit.
- Avoid broad refactors unless they are required for the requested change.

## Safety Rules

- Never commit secrets, tokens, chat IDs, private keys, or local credentials.
- Keep environment-specific values in environment variables or ignored local files.
- Do not change production-facing behavior without a clear reason and verification path.
- Preserve existing public APIs unless the user explicitly requests a breaking change.

## TypeScript Rules

- Prefer explicit types where they clarify contracts.
- Prefer explicit generics on collection transforms when they clarify the intended output shape, e.g. `items.flatMap<ResultType>(...)`, instead of relying on broad inference.
- Do not weaken types with `any` unless there is no practical local alternative.

## Verification Rules

- Run the narrowest relevant test, lint, or typecheck command after code changes when practical.
- If verification cannot run, state the reason and the exact command that should be run later.
