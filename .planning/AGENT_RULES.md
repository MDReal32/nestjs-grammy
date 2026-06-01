# AGENT_RULES

## Operating Mode

- Treat repository instructions and explicit user requests as authoritative.
- Read only the code and docs needed for the current task.
- Prefer understanding the local pattern before implementation.
- Keep implementation and verification scoped to the requested behavior.

## Planning Discipline

- Use a short plan for multi-step work.
- Keep task notes outcome-based and verifiable.
- Do not mark work complete until the changed behavior has evidence from tests, typechecks, lint, build output, or a stated manual check.
- Implementation work must report the verification command, manual check, or explicit reason verification could not run.

## Safety Discipline

- Never store plaintext secrets in docs, logs, tests, fixtures, or committed config.
- Do not weaken authentication, authorization, validation, or error handling without explicit user approval.
- Preserve public APIs and documented behavior unless the task requires changing them.

## Codebase Discipline

- Read existing patterns before deleting or rewriting code.
- Prefer small, explicit modules over hidden cross-module coupling.
- Keep tests close to the behavior being changed.
- Do not preserve old code solely because it exists.
