# Commandes & détection auto

## Un mot (session)

| Mot | Effet |
|-----|--------|
| `bonjour` | Ouvre la session |
| `go` | P0 `TODO.md` |
| `fin` | Handoff compressé |
| `compresse` | Réponse courte |
| `explique` | Réponse détaillée |
| `scope` | IN/OUT v1 |

## Phrase libre (automatique)

**Tu n’as pas à `@` un fichier.** Écris normalement :

- « améliorer le dashboard résultats » → slice **design**
- « corriger la marge cas 7 » → **formulas** + **tests**
- « init Next.js » → **architecture** + **tasks**

Mots-clés : `docs/intent-map.json` (éditable par projet).

## Technique

- `before-prompt.ps1` — mot unique OU détection domaine
- `postToolUse` — injecte le contexte une fois
- Règle : `domain-docs-slice.mdc`
