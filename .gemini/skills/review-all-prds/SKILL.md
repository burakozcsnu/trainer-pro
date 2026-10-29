---
name: review-all-prds
description: "Cross-check every PRD in design/prd/ for coherence — pillar alignment, acceptance completeness, analytics coverage, platform parity, and non-goal discipline. Produces a consolidated findings report."
argument-hint: "[no arguments]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit
---

# Review All PRDs

Run a studio-wide check on product specs before a sprint planning or
milestone gate.

## Phase 1 — Inventory

List all PRDs in `design/prd/` with status: draft / approved / shipped.

## Phase 2 — Per-PRD check

For each PRD, verify the template sections are complete:

- [ ] **Problem** clearly stated in user POV
- [ ] **User + JTBD** specific (not "all users want X")
- [ ] **Scope vs. non-goals** both filled
- [ ] **Acceptance criteria** observable, at least 3
- [ ] **UX** linked to ux-spec
- [ ] **Analytics** events named + property schema
- [ ] **Rollout** plan with gates
- [ ] **Risks** with mitigations

## Phase 3 — Cross-PRD checks

### Pillar coverage
Which pillars does each PRD serve? Are any pillars orphaned (no PRD)?
Are any PRDs orphaned (serve no pillar)?

### Platform parity
For features supposed to be cross-platform, do the PRDs specify iOS vs.
Android divergence explicitly?

### Analytics taxonomy
Are event names consistent across PRDs? Any duplicate events for the
same action under different names?

### Dependency graph
Which PRDs block others? Is the sprint order consistent with blocks?

## Phase 4 — Findings report

Write `design/prd/review-<YYYY-MM-DD>.md`:

```markdown
# PRD Review — <date>

## Summary
- N PRDs reviewed
- P complete / Q draft / R missing sections
- Key concerns: ...

## Per-PRD
### PRD-014 — Workout Program Library
Status: draft
Missing: analytics section, rollout plan
Pillar alignment: serves "Guided Progress" (P1)
Notes: blocks PRD-019

...

## Cross-cutting

### Pillar coverage
- "Guided Progress" covered by PRD-014, PRD-019 — consistent
- "Habit Loop" covered by PRD-007 — OK
- "Community" — NO PRDs in flight (gap)

### Taxonomy drift
- `workout_start` (PRD-007) vs `session_start` (PRD-014) — same action,
  two names. Pick one.
```

## Delegation

Owned by `product-manager`. Review by `product-director` at milestone
gates.
