---
name: accessibility-audit
description: "Run a structured accessibility audit on a feature or the whole app against WCAG 2.2 AA, platform accessibility APIs, and Dynamic Type/font-scale. Produces a findings report with severity and fix recommendations."
argument-hint: "[feature-name or 'full']"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit
---

# Accessibility Audit

## Scope

If argument is `full`: audit top-10 flows.
If argument is a feature name: scope to that feature.

## Phase 1 — Automated Pre-check

- iOS: `xcrun simctl ui <sim> appearance` to test light/dark/high-contrast
- Android: Accessibility Scanner APK on an emulator
- Document issues surfaced; automated tools won't catch everything.

## Phase 2 — Manual Pass (per screen)

### Contrast
- [ ] Every text / background pair ≥ 4.5:1 (normal), 3:1 (18pt+)
- [ ] Status not conveyed by color alone (icon + text + color)

### Touch targets
- [ ] Interactive elements ≥ 44×44 pt (iOS) / 48×48 dp (Android)
- [ ] Spacing between targets avoids accidental taps

### Dynamic Type / Font Scale
- [ ] Render at 200% / XXL — no clipping, no horizontal overflow
- [ ] Screenshots of every screen at max size

### Screen Readers
- [ ] VoiceOver (iOS) — every interactive has a label + trait
- [ ] TalkBack (Android) — same
- [ ] Reading order matches visual order
- [ ] Decorative images ignored (isAccessibilityElement = false)
- [ ] Custom controls re-declare accessibility

### Motion
- [ ] Reduce motion honored; heavy animations fall back to crossfade or none
- [ ] No auto-playing video without control

### Input
- [ ] Keyboard input on iPad / external keyboard works
- [ ] Switch Control (iOS) / Switch Access (Android) usable
- [ ] Voice Control reachable for common actions

## Phase 3 — Report

Write `production/a11y/<YYYY-MM-DD>-audit-<scope>.md`:

```
# Accessibility Audit — <scope>
## Summary
Total findings: N (H / M / L severity)

## Findings
### A11Y-01 — [H] Tap target too small on WorkoutRow "Start"
**Where**: src/ios/Features/Workout/WorkoutRow.swift:42
**Description**: 30x30 pt tap target fails 44x44 minimum.
**Fix**: Increase accessibilityFrame or pad the button.
**WCAG**: 2.5.5
```

## Delegation

Owned by `accessibility-specialist`. Coordinates with feature engineers
for fixes.
