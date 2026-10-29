# Hooks Reference

Lifecycle shell scripts in `.agent/hooks/`. Wired into Gemini CLI
via `.agent/settings.json` → `hooks:`.

| Event | Script | Purpose |
|---|---|---|
| SessionStart | `session-start.sh` | Print project state + next-step hint |
| SessionStart | `detect-gaps.sh` | Surface config gaps (engine not set, no PRD, etc.) |
| PreToolUse (Bash) | `validate-commit.sh` | Block commits that would break conventions |
| PreToolUse (Bash) | `validate-push.sh` | Block pushes without green tests |
| PostToolUse (Write|Edit) | `validate-assets.sh` | Asset / icon / screenshot validations |
| PostToolUse (Write|Edit) | `validate-skill-change.sh` | Lint `.agent/skills/*` changes |
| Notification | `notify.sh` | Route notifications to user |
| PreCompact | `pre-compact.sh` | Preserve state before compaction |
| PostCompact | `post-compact.sh` | Restore state after compaction |
| Stop | `session-stop.sh` | Write session log entry |
| SubagentStart | `log-agent.sh` | Audit trail of delegated tasks |
| SubagentStop | `log-agent-stop.sh` | Same — close the audit trail |

Sub-documents live under `.agent/docs/hooks-reference/`.

## Modifying hooks

- Any change to hook scripts should be tested locally first
- Hooks run for every user's session — breakage blocks everyone
- Keep hook execution time < 5s; longer → move to async job
- Use `statusMessage` in settings.json to give users feedback during
  long hooks
