# RULES - Repository Governance Contract

This document defines implementation structure, coding discipline, module boundaries, and AI-agent behavior for this repository.

It applies to all source files unless a narrower local rule explicitly overrides it. If a requested change would violate these rules, stop and ask.

## 1. Authority

`RULES.md` governs implementation structure, coding discipline, module boundaries, and agent behavior.

`RTK.md` and `.planning/**` govern operational workflow for agents.

When implementation reality and instructions disagree:

1. Do not improvise.
2. Check the nearest applicable instruction file.
3. Ask before changing scope.

## 2. Engineering Philosophy

Prefer:

- explicit structure
- boring architecture
- strong ownership boundaries
- local reasoning
- maintainable code over clever code
- controlled convergence toward stable patterns

Always prefer:

- clarity over compactness
- explicit code over clever code
- stable structure over smart abstractions
- readable files over fewer files
- direct ownership over generic shared systems
- behavior preservation over broad rewrites

When touching a scoped area:

- converge toward the best proven local repository pattern
- clean small related duplication
- remove obsolete code related to the current task
- preserve behavior unless the task explicitly changes it
- avoid unrelated repository-wide rewrites

## 3. Pre-Coding Research Rule

Before writing code that depends on a library, framework, runtime, generator, or tool:

1. Verify the installed version from `package.json` and the lockfile.
2. Verify the feature exists in that version using official docs, installed types, or installed source.
3. Search the repository for existing usage and follow the established pattern.
4. Prefer non-deprecated APIs when the installed version marks an API deprecated.

Rules:

- never code against guessed library behavior
- never rely on stale memory when the repository version can be checked
- prefer official documentation and primary sources for the exact installed version
- verify generator flags before running scaffolding

Final order:

```text
version first -> research second -> code third
```

## 4. Non-Negotiable Rules

The following rules have priority over style preference:

- one file = one clear responsibility
- public entrypoints stay lightweight
- decorators stay declarative
- modules own dependency wiring
- services own application orchestration
- adapters own external library details
- shared contracts cross boundaries through explicit package exports
- no dumping-ground folders or modules
- no hidden cross-module coupling
- safety-sensitive paths fail closed

If these rules conflict with existing weak code, improve the touched area toward these rules.

## 5. File Responsibility

Prefer one exported entity per file.

An entity may be:

- class
- interface
- type
- enum
- function
- constant
- DTO
- Nest provider
- service
- module
- decorator
- adapter

Allowed:

```ts
export class TelegramModule {}
```

```ts
export interface BotInstanceOptions {}
```

```ts
export type LogLevel = "debug" | "info" | "warn" | "error";
```

Avoid unrelated exports in one file. If a second export represents a different responsibility, create a second file.

### 5.1 Filename Rule

The filename must reflect the exported entity or responsibility.

Good:

```text
telegram.module.ts
bot-registry.ts
bot-instance-options.ts
make-rate-limit.ts
```

Avoid suffix noise:

```text
bot-instance-options.type.ts
make-rate-limit.function.ts
```

### 5.2 Interface vs Type Alias

Use `interface` for object shapes.

Use `type` for:

- unions
- intersections
- mapped types
- conditional types
- primitive aliases
- tuple/function aliases

When a union is made from object shapes:

- define each object variant as a named `interface`
- keep exported variant interfaces in their own files when they are reused
- define/export the union type from the module/package boundary when it is public

## 6. Absolute Bans

Do not introduce:

- nested ternaries
- giant inline ternaries
- huge one-line objects
- huge one-line conditions
- `as unknown as`
- unsafe request casting
- decorators with hidden business logic
- modules with business logic
- services that mix orchestration, parsing, registry state, and external provider details
- static utility classes
- vague names
- magic auto-registration that is difficult to trace
- reflection-heavy meta-programming without a clear NestJS integration reason
- god services
- god classes
- files with multiple responsibilities
- silent fallback behavior
- deeply nested conditional trees
- premature abstractions
- generic workflow engines without repeated concrete need

If code drifts toward these patterns, refactor the touched area immediately.

## 7. Module Ownership

One folder represents one domain, runtime concern, or coherent responsibility.

Good:

```text
decorators
module
registry
runtime
tokens
logging
rate-limit
```

Bad:

```text
common
shared-business
general
misc
all-services
helpers
```

Folder names must describe real ownership.

## 8. Source Structure

Do not let `src/*` become flat sprawl.

Organize code by the strongest local ownership axis:

- feature
- runtime
- layer
- responsibility
- adapter
- integration
- module
- protocol

Rules:

- prefer a clear tree over root-level sprawl
- one folder = one clear responsibility
- avoid giant utility dumping grounds
- shared reusable logic belongs behind explicit module or package boundaries
- new features extend the tree instead of polluting the root
- root-level `src/*` stays minimal and intentional
- public exports flow through the approved boundary file

## 9. Entrypoints

`src/main.ts` is the primary package boundary.

Allowed inside `main.ts`:

- public exports
- stable package API aggregation

Forbidden inside `main.ts`:

- business logic
- feature implementations
- large helper functions
- parsing logic
- reusable utilities
- runtime internals

Internal code must still follow tree structure. Small packages do not get permission to collapse into root-level source files.

## 10. NestJS Responsibility Rules

### 10.1 Module Files

Module files own:

- imports
- providers
- exports
- module configuration

They must not contain:

- business logic
- helper logic
- mapping logic
- runtime orchestration

### 10.2 Services

Services own:

- application orchestration
- coordinating same-responsibility collaborators
- calling approved abstractions
- managing lifecycle where appropriate

Services must not contain:

- decorator metadata parsing that belongs in binder/registry code
- provider implementation details that belong in adapters
- hidden cross-module state mutation

### 10.3 Decorators

Decorators own:

- metadata declaration
- thin argument normalization

Decorators must not contain:

- runtime execution
- dependency lookup
- business logic
- external API calls

### 10.4 Registry and Runtime Code

Registry and runtime code must keep ownership explicit:

- registry code owns registration and lookup state
- runtime code owns startup/shutdown behavior
- external library calls should be isolated behind readable local functions or adapters when complexity grows

## 11. Shared Boundaries

Shared code must be intentional and explicit.

Use root `types/` when:

- the type is reused across modules
- the type represents a stable public or internal contract
- the type no longer belongs to one module only

Use root `utils/` only when:

- the function is reused across modules
- the function is domain-neutral
- the function is generic enough to share safely

Forbidden dumping-ground folders:

```text
helpers/
common/
shared/
misc/
lib/
stuff/
base/
```

If ownership is unclear, stop and decide ownership before coding.

## 12. Dependency Direction

Cross-module imports are allowed only through stable boundaries.

Allowed:

- public package boundary
- root shared types
- root shared utilities
- approved exported service/module APIs
- approved provider abstractions

Forbidden:

- importing another module's private internals when a public boundary exists
- importing another module's `utils/` unless promoted
- importing another module's `types/` unless promoted
- importing runtime internals from decorators

If something becomes shared, promote it deliberately or expose it through a stable boundary.

## 13. Type Rules

Prefer TypeScript inference for return types.

Add explicit return types only when:

- inference becomes unclear
- readability improves materially
- TypeScript would infer `any`
- a public API contract benefits from being explicit

Object contracts should use `interface`.

Use `type` for:

- unions
- primitive aliases
- discriminated union aliases
- cases `interface` cannot express cleanly

Use generics to remove duplicated containers. Do not create type puzzles.

Generics must reduce duplication and improve clarity.

## 14. Naming Rules

Names must describe purpose.

Good:

```text
BotRegistry
DecoratorsBinder
TelegramModule
resolveMode
makeRateLimit
```

Bad:

```text
Helper
Utils
Manager
Processor
ThingService
```

Module and file names use lowercase kebab-case.

Good:

```text
bot-registry.ts
decorators-binder.ts
telegram-module-async-options.ts
make-rate-limit.ts
```

Bad:

```text
BotRegistry.ts
botRegistry.ts
bot_registry.ts
utils.ts
helper.ts
processor.ts
```

## 15. Function and Class Style

Rules:

- one function = one purpose
- one service = one responsibility
- one class = one responsibility
- standalone functions are preferred for pure logic
- do not create classes only to group helpers
- private methods are allowed only when small, local, and not domain-significant

If a class starts coordinating unrelated concerns, split it.

## 16. Formatting Rules

Optimize for reviewability.

Object literals with more than 3 properties should be multiline.

Bad:

```ts
const input = { id, name, source, confidence, createdAt, expiresAt };
```

Good:

```ts
const input = {
  id,
  name,
  source,
  confidence,
  createdAt,
  expiresAt
};
```

Guard clauses must use braces.

Bad:

```ts
if (!source) throw new Error("missing source");
```

Good:

```ts
if (!source) {
  throw new Error("missing source");
}
```

Do not build large objects inside ternaries. Use explicit `if` blocks.

## 17. Logging and Errors

Do not use `console.log` in library code.

Logs must be structured and meaningful when logging is part of the local abstraction.

Errors must fail explicitly.

Bad:

```ts
throw "something failed";
```

Good:

```ts
throw new Error("bot initialization failed");
```

Rules:

- malformed input fails explicitly
- invalid external library state fails explicitly
- degraded behavior is logged when logging is available
- safety-sensitive uncertainty rejects by default

## 18. Fail-Closed Rule

Safety-sensitive flows must fail closed.

Fail closed means:

- unknown validation state rejects
- missing required configuration rejects
- timeout during safety validation rejects
- internal validation failure rejects
- partial validation rejects

Prefer explicit rejection over implicit continuation.

## 19. Refactoring Triggers

Refactor the touched scope when:

- a file becomes multi-purpose
- a function grows too large
- a module gains unrelated responsibilities
- unsafe casts appear
- duplicated mapping appears
- cross-module imports increase in unstable ways
- module-local utilities are reused by other modules
- module-local types are reused by other modules
- obsolete code related to the current task remains in place

Do not postpone obvious local cleanup.

Do not use local cleanup as permission for unrelated repository-wide rewrites.

## 20. Output Expectations

Generated or refactored code must be:

- explicit
- readable
- typed
- modular
- NestJS-native where applicable
- responsibility-owned
- easy to review

Never optimize for fewer files.

Never invent structure without checking the local pattern.

## 21. Final Implementation Checklist

Before submitting code, verify:

- installed versions were checked before coding
- repository usage was searched before adding a new pattern
- filenames match exported responsibilities
- each file has one clear responsibility
- public exports flow through the intended boundary
- decorators stay declarative
- modules stay focused on dependency wiring
- services avoid hidden cross-module state mutation
- unsafe casts are avoided
- formatting is readable
- no dumping-ground folders were created
- touched weak structure was improved where safe

If any answer is no, fix it before handing off.

Final rule:

Choose the more explicit and maintainable version every time.
