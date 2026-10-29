---
name: crash-triage
description: "Triage the last N crashes/ANRs from Crashlytics/Sentry: cluster by signature, prioritize by user impact, assign owners, and draft repro steps. Produces a triage doc with action items."
argument-hint: "[hours e.g. 24h | 48h | 7d]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit, Bash
---

# Crash Triage

## Phase 1 — Ingest

Ask the user to paste or link Crashlytics / Sentry reports for the time
window (or the project uses a script to dump them). Expect each crash with:
- signature (top frame + exception class)
- user count affected
- sessions affected
- first seen / last seen version
- platform + OS + device
- breadcrumbs / logs if available

## Phase 2 — Cluster & Prioritize

Cluster by signature. Rank by user impact:

```
P0 — crash-free < 99% for the cluster OR affecting > 1% DAU
P1 — affecting 0.1-1% DAU, no workaround
P2 — affecting < 0.1% DAU, workaround exists
P3 — rare (< 10 affected users), edge case
```

## Phase 3 — Repro Hypothesis

For each P0/P1:
- First frame → likely feature owner
- Device concentration → platform / OS bug?
- Version concentration → regression from specific release
- Breadcrumbs → last user action before crash

Draft 1-2 repro steps per issue. If no repro hypothesis: tag
NEEDS_INVESTIGATION and assign to `systematic-debugging` skill owner.

## Phase 4 — Output

Write `production/crash-triage/<YYYY-MM-DD>-triage.md`:

```
# Crash Triage — <window>
## P0 (blocker release)
- C-01 `NSInvalidArgumentException` in WorkoutSessionView.save
  - users: 237, sessions: 412, first: 1.4.0
  - owner: @alice / ios-specialist
  - repro: start session → rotate → save
  - fix path: add nil check in save path, ship hotfix
## P1 ...
## P2 ...
```

## Phase 5 — Hand Off

- P0: file hotfix story, page `release-manager`
- P1: file bug in next sprint backlog with acceptance = regression test
- P2 / P3: backlog with priority tag

## Delegation

Owned by `qa-lead`. Deep debugging by `systematic-debugging` skill.
