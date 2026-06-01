# DOC_STANDARDS

## Documentation Layers

| Layer                   | File                                   |
| ----------------------- | -------------------------------------- |
| Project overview        | `README.md`                            |
| Repository governance   | `RULES.md`                             |
| Runtime agent contract  | `RTK.md`                               |
| Agent workflow rules    | `.planning/AGENT_RULES.md`             |
| Documentation standards | `.planning/DOC_STANDARDS.md`           |
| Operational playbooks   | `.planning/runbooks/TASK_PLAYBOOKS.md` |
| Package docs            | `packages/*/README.md`                 |

## Rules

- Keep durable behavior and usage notes in `README.md`.
- Keep implementation structure and code style rules in `RULES.md`.
- Keep agent-specific operating rules out of product documentation.
- Keep task playbooks checklist-oriented and free of project-specific history.
- Keep technical decisions near the code or docs they affect unless a dedicated decision log is added.
- Avoid copying planning artifacts from another project unless their content is reusable in this repository.
