---
name: usability-test-report
description: "Capture findings from a usability test session: participants, tasks, observations per task, friction patterns, recommended fixes. Writes production/usability/<YYYY-MM-DD>-<feature>.md."
argument-hint: "[feature-or-flow]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit, AskUserQuestion
---

# Usability Test Report

Structured capture of a usability test session. Runs in a moderated or
unmoderated format.

## Report template

```markdown
# Usability Test — <feature>
Date: YYYY-MM-DD
Moderator: @name
Participants: N (demographics anonymized)
Device mix: iOS X, Android Y
Duration: ~30min / participant

## Tasks tested
- T1: "Complete your first workout session"
- T2: "Find and restart a previous workout"
- T3: "Share your progress to a friend"

## Findings (by task)

### T1 — first workout session
**Success rate**: 4/5 completed unassisted
**Time p50**: 2m 15s (target: 90s)

**Friction observed**:
- 3/5 confused by "Add set" vs. "Next exercise" — same visual weight
- 2/5 missed the timer pause because the button is below the fold

**Quotes**:
- P2: "I thought tapping next would add a set"
- P4: "I paused my phone, assumed timer paused"

### T2 — find previous workout
**Success rate**: 2/5

...

## Patterns across tasks
1. **Visual hierarchy failing on primary CTAs** — affected T1 and T3
2. **Timer / session state unclear** when app backgrounded — T1, T2

## Recommendations (prioritized)

### P0 — ship in next sprint
- Change primary CTA to high-contrast style; demote secondary
- Show session state in status bar on iOS (Live Activity) + Android notification

### P1 — next sprint
- History search UX rework

### P2 — backlog
- Social share preview styling

## Severity rubric
- P0: > 50% participants fail or abandon
- P1: significant friction, but users completed
- P2: cosmetic or edge-case
```

## Phases

1. Collect raw observations (notes, video, transcript) per participant.
2. Tag each observation with task ID + severity.
3. Cluster into patterns; promote to recommendations.
4. Write report. Hand off to `product-manager` for story creation.

## Delegation

Owned by `ux-lead`. Participants recruited by `product-manager` +
`growth-lead`.
