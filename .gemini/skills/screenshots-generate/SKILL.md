---
name: screenshots-generate
description: "Generate App Store + Play Store screenshots from device frames + app screens, with localized text overlays. Uses Fastlane snapshot (iOS) + Fastlane screengrab (Android) or design-tool templates."
argument-hint: "[no arguments]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit, Bash
---

# Screenshots Generate

Produce store-ready screenshots for every supported device size + locale
without a week of manual work.

## Two strategies

### Strategy A — Fastlane + UI tests (automated)

For apps with good UI test coverage:
- `fastlane snapshot` drives iOS simulators, takes screenshots from
  UI tests, writes to `fastlane/screenshots/<locale>/<device>/...`
- `fastlane screengrab` does the same for Android
- Frame via `fastlane frameit` with device frames + overlay captions from
  `Framefile.json`

Best when: team already has UI tests, needs many locales.

### Strategy B — Design-tool templates (manual but controlled)

- Figma / Sketch template per screen per device size
- App screen exported as PNG, dropped into template
- Overlay text localized via a spreadsheet-driven plugin (e.g.,
  Figma variables + CSV)
- Export batch → PNG per locale per device

Best when: team has strong design control, fewer locales.

## Required device sizes

**iOS** (App Store Connect minimum):
- 6.9" iPhone 16 Pro Max (1290×2796)
- 6.7" iPhone 15 Pro Max / iPhone 16 Plus
- 5.5" iPhone 8 Plus (legacy — still required for some app categories)
- iPad 13" / 12.9" if iPad-supported

**Android** (Play minimum):
- Phone: at least 2 screenshots, 16:9 or taller, 320-3840 px
- 7" and 10" tablet screenshots if tablet-supported

## Screen storyboard (first 5 = the hook)

1. **The promise** — one-line value prop + hero screen
2. **The core loop** — what the user does daily
3. **The magic moment** — the thing this app does that others don't
4. **The proof** — testimonial / rating / press / users count
5. **The breadth** — secondary features

## Localization

For each supported market, regenerate with:
- Translated overlay text
- Screens with localized content (date/time format, currency,
  culturally-appropriate imagery)
- Right-to-left variants if applicable

## Delegation

Owned by `aso-specialist` + `design-director`. Automation by
`tools-engineer`.
