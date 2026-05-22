$script:WordMessage = @'
[HOOK: bonjour] Session start.
- Read docs/DOMAINS.md only (manifest), then ONE domain if needed.
- Use user @-mentions or P0 from their message; do NOT read NEXT_SESSION_HANDOFF unless @.
- Grep before Read; max 1 domain doc + 3-5 code files.
- Reply short: confirm P0 understood, no recap.
'@
