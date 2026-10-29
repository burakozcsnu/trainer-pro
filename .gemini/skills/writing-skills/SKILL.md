---
name: writing-skills
description: "Framework for authoring a new Gemini CLI skill — frontmatter, structure, phase discipline, and tests. Adapted from obra/superpowers writing-skills skill."
argument-hint: "[skill-name]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit, Bash
---

# Writing Skills

A good skill is a procedure, not a paragraph. It tells the model what to do,
in what order, and when to stop.

## Directory layout

```
.agent/skills/<skill-name>/
  SKILL.md         # required — the skill itself
  scripts/         # optional — helper scripts the skill invokes
  templates/       # optional — files the skill writes from
```

## Frontmatter

```yaml
---
name: skill-name                 # kebab-case, must match dir
description: "..."               # one line, actionable, in plain English
argument-hint: "[arg]"           # what the user types after /skill-name
user-invocable: true             # set false for skills only called by agents
allowed-tools: Read, Glob, ...   # minimum tools required
---
```

## Body structure

1. **H1 with skill name**
2. **1-2 sentence purpose** (more concrete than the description)
3. **Phases with headings** (## Phase 1, ## Phase 2, …)
4. **Exit conditions / verdict**: what state is "done" for this skill?
5. **Delegation**: which agent owns this, who it hands off to

## Principles

- **Small steps** — every phase should complete in < 5 minutes
- **Ask before writing** — list `AskUserQuestion` in allowed-tools if needed
- **Write once** — every `Write` call is stated explicitly
- **Failure modes** — if a phase can fail, describe the recovery
- **Idempotent** — safe to re-run; don't corrupt state

## Tests (for important skills)

Under `.agent/skills/<name>/tests/`:
- `test-cases.md` — behavioral scenarios (input → expected output)
- `evidence/` — saved screenshots or transcripts of the skill working

## Delegation

Skill authors across all teams. Review via `skill-improve`.
