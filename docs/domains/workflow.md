# Domain: workflow

Rules: `.cursor/rules/project-end-compress.mdc`, `session-fin-handoff-block.mdc`, `domain-docs-slice.mdc`. Template: `docs/HANDOFF_TEMPLATE.md`.

| Mot (1 seul) | Meaning |
|--------------|---------|
| **bonjour** | User `@` files or P0 from last message; handoff optional (3-row archive only) |
| **go** | Implement one P0 task |
| **fin** | **Compress:** handoff = fait · commit · P0 only; ≤5-line reply + starter block; commit if changed |
| **compresse** | Short reply; no narrative dump |
| **explique** | Detailed reply (not for handoff) |
| **scope** | Recall v1 IN/OUT only — load `docs/domains/scope.md` |

**Hooks:** `.cursor/HOOKS.md` · script par mot : `.cursor/hooks/words/<mot>.ps1`

**End of any session:** save only inevitable project facts — never the discussion (see `project-end-compress.mdc`).

**Docs:** always `docs/DOMAINS.md` → one domain file; never full brief.
