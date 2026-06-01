# AGENTS

**Runtime contract:** [`RTK.md`](RTK.md).

**Repository rules:** [`RULES.md`](RULES.md).

**AI / agent discipline:** [`.planning/AGENT_RULES.md`](.planning/AGENT_RULES.md).

**Documentation map:** [`.planning/DOC_STANDARDS.md`](.planning/DOC_STANDARDS.md).

**Operational playbooks:** [`.planning/runbooks/TASK_PLAYBOOKS.md`](.planning/runbooks/TASK_PLAYBOOKS.md).

**Type clarity:** Prefer explicit generics on collection transforms when they clarify the intended output shape, e.g. `items.flatMap<ResultType>(...)`, instead of relying on broad inference.
