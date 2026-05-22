# One-word hooks (copy with domain-docs template)

Copy to project root:

```powershell
Copy-Item -Recurse ".cursor/templates/domain-docs/hooks/*" ".cursor/hooks/" -Force
Copy-Item ".cursor/templates/domain-docs/hooks.json" ".cursor/hooks.json"
Copy-Item ".cursor/templates/domain-docs/workflow-words.mdc" ".cursor/rules/workflow-words.mdc"
Copy-Item ".cursor/templates/domain-docs/HOOKS.md" ".cursor/HOOKS.md"
```

Edit each `.cursor/hooks/words/<mot>.ps1` for project-specific paths.

**Words:** bonjour · go · fin · compresse · explique · scope
