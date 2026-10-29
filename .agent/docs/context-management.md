# Context Management

Gemini CLI has a finite context window. These practices keep the
conversation efficient.

## Pre-session

- Run `/start` on first session — establishes where you are
- `settings.local.json` controls permission prompts and accepted edits
- `.agent/docs/technical-preferences.md` is the tech-stack ground truth

## During a session

- Use the right-sized agent: Haiku for simple lookups, Sonnet for most
  work, Opus for architecture and strategy
- Delegate to subagents (`Task` tool) when the work benefits from a
  scoped fresh context
- Run `/context-budget` when the conversation feels heavy — identifies
  bloat and suggests prune

## Between sessions

- Commit work in progress; `git log` + branch state is the handoff
- For long-running work, write a progress note in
  `production/session-logs/`
- `/start` on the next session detects state and picks up

## Cost controls

- `/cost-aware-llm-pipeline` skill picks model per task complexity
- `/content-hash-cache-pattern` avoids reprocessing files that haven't
  changed
- Avoid re-reading the same file every turn; rely on your existing context

## Compaction

- `/pre-compact` + `/post-compact` hooks preserve structured state
  across compaction
- Don't rely on mid-conversation details surviving compaction — if it
  matters, write it to disk
