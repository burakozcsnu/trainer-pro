---
name: push-notification-plan
description: "Plan a push notification lifecycle program: triggers, segments, copy variants, frequency caps, opt-in UX, success metrics."
argument-hint: "[no arguments]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit
---

# Push Notification Plan

## Phase 1 — Opt-in UX

- Do NOT ask for push permission on first launch.
- Ask after the user has seen value (first core-loop completed OR after a
  value-proposition screen that honestly describes what pushes they'll get).
- Use iOS provisional authorization for low-friction onboarding.
- Respect platform permission decision — if declined, don't re-ask for 30d.

## Phase 2 — Triggers × Segments

Grid of lifecycle triggers vs. user segments:

| Trigger / Segment | New user (0-7d) | Habit (7-30d) | At risk (no open 14d) | Dormant (30d+) |
|---|---|---|---|---|
| Morning reminder | 7am local | 7am local | ✗ | ✗ |
| Streak milestone | ✓ at streak 3 | ✓ at streak 7, 30 | ✗ | ✗ |
| Win-back | ✗ | ✗ | Day 15, 22, 29 | Day 35 (once) |
| New content | ✗ | Weekly digest | ✗ | ✗ |

## Phase 3 — Copy

For each trigger, three copy variants:

```yaml
trigger: morning_reminder_new
segment: New user (D2)
variants:
  A: "Ready for your second session? Pick up where you left off."
  B: "15 minutes today keeps the habit alive. Your program is ready."
  C: "Morning! 3 exercises today."
```

Track which variant wins per segment.

## Phase 4 — Frequency Caps

- Max 2 pushes per user per day
- Max 5 per week
- Snooze after 3 consecutive unopened pushes of the same type
- Quiet hours respected per user's local timezone

## Phase 5 — Success Metrics

Per trigger:
- Delivery rate
- Open rate
- Action-completion rate (opened AND did the intended action)
- Disable rate (user turns off notifications after this push)

Target: open rate > 4% on new content; > 15% on reminders.

## Output

Write `design/growth/push-plan.md` with segments, triggers, copy, caps,
and metrics. Implementation issues filed per trigger.

## Delegation

Owned by `growth-lead`. Copy by `content-strategist`.
Instrumentation by `growth-engineer` / `analytics-engineer`.
