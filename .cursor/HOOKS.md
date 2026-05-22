# Commandes en un mot

Tape **un seul mot** puis Entrée (rien d’autre sur la ligne).

| Mot | Effet |
|-----|--------|
| `bonjour` | Ouvre la session (DOMAINS, pas handoff) |
| `go` | Implémente le P0 de `TODO.md` |
| `fin` | Clôture compressée + handoff |
| `compresse` | Réponse courte |
| `explique` | Réponse détaillée |
| `scope` | Rappel IN/OUT v1 |

**Exemple avec détail :** `go ajouter page capacity` → le mot `go` + ta phrase (hook + texte libre).

**Technique :** `.cursor/hooks/words/<mot>.ps1` · config `.cursor/hooks.json`
