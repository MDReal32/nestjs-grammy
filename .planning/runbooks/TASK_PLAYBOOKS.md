# TASK_PLAYBOOKS

## Implementation Playbook

1. Inspect the relevant module, tests, and public docs.
2. Identify the existing local pattern.
3. Make the smallest change that satisfies the requested behavior.
4. Add or update focused tests when the change affects behavior.
5. Run the narrowest useful verification command.
6. Summarize changed files, verification, and any remaining risk.

## Documentation Playbook

1. Confirm the documentation target and audience.
2. Remove project-specific references copied from other repositories.
3. Link to canonical local files instead of duplicating long content.
4. Keep instructions concise and actionable.
5. Verify referenced files exist.

## Safety Review Playbook

1. Check whether the change touches secrets, user data, external APIs, or permissions.
2. Confirm sensitive values remain outside committed source.
3. Preserve validation and error handling around external boundaries.
4. Add tests or manual checks for failure paths when practical.
