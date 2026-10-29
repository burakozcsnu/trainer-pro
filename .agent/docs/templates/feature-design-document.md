# Feature Design Document — <feature name>

**Status:** draft | approved | shipped
**Owner:** @product-manager
**Last updated:** YYYY-MM-DD
**Linked PRD:**

---

## Summary

3-5 sentences. What this feature does, for whom, against which pillar.

## Screens in scope

- `<ScreenA>` — entry / overview
- `<ScreenB>` — primary action
- `<ScreenC>` — confirmation / result

Each screen has a ux-spec at `design/ux-spec/<ScreenX>.md`.

## Core loop

```
[Launch] → [ScreenA] → tap primary → [ScreenB] → submit → [ScreenC] → home
```

## Data model

| Entity | Fields | Persistence |
|---|---|---|
| `WorkoutSession` | id, startedAt, exercises[], rpe | SwiftData / Room |
| … | | |

## API contract

- `POST /v1/workout_sessions` — create session
- `PATCH /v1/workout_sessions/:id` — update with sets
- `GET  /v1/workout_sessions` — paginated list

Link to `design/api/workout-sessions.md`.

## State + events

| Event | Triggered by | Handler |
|---|---|---|
| `workout.started` | tap _Begin_ | create session → navigate |
| `workout.setLogged` | tap _Log set_ | append set → persist |
| `workout.completed` | tap _Finish_ | close session → analytics |

## Edge cases

- No network: queue locally, sync on reconnect
- App backgrounded mid-session: session persists, timer resumes
- Interrupted by phone call: pause timer
- Device dies: session restored on relaunch from persistence

## Accessibility

- VoiceOver / TalkBack labels documented in ux-spec
- Timer announceable periodically (opt-in)
- Haptic feedback paired with visual state changes

## Instrumentation

Event spec in `data/events/`. Every user-visible action emits.

## Rollout + flag

- Flag: `ff_workout_v2`
- Default: OFF
- Owners: @alice (PM), @bob (eng)

## Open questions

- Q1:
