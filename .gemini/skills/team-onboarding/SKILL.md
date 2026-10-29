---
name: team-onboarding
description: "Mobilize the onboarding-feature subteam — coordinated lineup for sign-up flow, first-run experience, permission asks, opt-ins, and activation measurement."
argument-hint: "[feature-description]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit, Task
---

# Team Onboarding

Coordinated subteam for onboarding work. Onboarding is where activation
lives or dies; it touches product, UX, growth, content, platform, and data.

## Team composition

- `product-manager` — PRD tied to activation metric
- `ux-lead` + `ux-designer` — flow with tap count as a constraint
- `content-strategist` — copy across every screen + permission asks
- `growth-lead` — funnel definition, drop-off tracking
- `data-lead` + `analytics-engineer` — activation event instrumentation
- `ios-specialist` + `android-specialist` — platform-idiomatic permission
  asks + provisional auth
- `motion-designer` — onboarding choreography
- `accessibility-specialist` — VoiceOver/TalkBack from first screen

## Non-negotiables

- **Ask permission after value**, not before. No push permission on screen 1.
- **Activation event** instrumented and shipping to dashboard.
- **Shortest path wins**: every extra screen costs ~3pp of completion.
- **Escape hatch**: skip button on screens where signup is not mandatory.
- **Resume on relaunch**: if user bailed mid-onboarding, return to their spot.

## Activation definition (starter)

```yaml
activation:
  definition: completed first core-loop event within 24h of install
  event:      <core_loop_event_name>_completed
  target_rate: 40%+ for D0; 55%+ for D7 install
```

## Delegation

Invoked by `product-manager` when onboarding redesign or first-run work
starts.
