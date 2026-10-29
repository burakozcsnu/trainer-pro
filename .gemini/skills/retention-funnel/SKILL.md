---
name: retention-funnel
description: "Define and instrument a retention funnel — from install through activation to habit — with events, metrics, and cohort views."
argument-hint: "[no arguments]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit
---

# Retention Funnel

Every mobile app needs a funnel definition. Without it, you can't debug
where users drop.

## Phase 1 — Define Stages

Typical mobile funnel:

```
Install         → app_open_first
Activation      → <core-loop-event> completed within 24h
D1 Retention    → app_open on day 1 (00-48h after install)
Habit           → 3+ sessions in D7
Paid (if monetized) → subscription_started OR purchase_completed
```

Customize per product. Fitness example:
```
Install → Activation = first workout started
        → Value      = first workout completed
        → Habit      = 3 workouts in 7 days
        → Retention  = app open on D7, D14, D28
```

## Phase 2 — Instrumentation

For each stage, specify the event:
```yaml
event: workout_started
fires_when: user taps "Begin" on workout detail screen
properties:
  workout_id: string
  source: enum [home, programs, history]
```

## Phase 3 — Cohort View

Dashboard should show:
- Funnel completion rate by cohort (install week)
- Time from install → activation (p50, p95)
- Day-of-funnel drop-off (which stage loses most users)

## Phase 4 — Targets + Actions

For each stage, set a target:
```
Install → Activation: target 60%, current 42%
```

When a target is missed by >10pp, funnel-debug meeting scheduled with
product-manager + growth-lead + data-lead.

## Output

Write `data/funnel.md` with definitions + targets. Wire the events if not
already present.

## Delegation

Owned by `data-lead`. Implementation by `analytics-engineer`.
