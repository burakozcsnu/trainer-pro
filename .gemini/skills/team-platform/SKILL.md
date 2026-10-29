---
name: team-platform
description: "Mobilize the platform-integration subteam — coordinated lineup for features that integrate with Apple / Google platform capabilities (HealthKit, HealthConnect, Widgets, App Intents, Siri, Wear OS, Watch, Live Activities, CarPlay, etc.)."
argument-hint: "[integration-name]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit, Task
---

# Team Platform

Platform integrations are where mobile apps earn their "native" badge.
This skill summons the specialists who have read the HIG / platform docs
and know the entitlements trail.

## Team composition

- `product-manager` — scope tied to a specific JTBD
- `technical-director` — arch impact (entitlements, background modes)
- `ios-specialist` + sub-specialists (swiftui, swift-concurrency, swift-persistence)
- `android-specialist` + sub-specialists (compose, coroutines, architecture)
- `security-lead` — data-sharing review if integration touches sensitive data
  (HealthKit, Location, Contacts)
- `ux-lead` — affordance for the integration (Widget layout, Watch glance,
  CarPlay interaction)
- `qa-lead` — test matrix extended to integration surfaces
- `release-manager` — entitlement + provisioning changes per release

## Integration decision checklist

- [ ] Entitlements required? Added to developer account + dev team?
- [ ] Privacy disclosures required? Updated in PrivacyInfo.xcprivacy +
      Play Data Safety?
- [ ] Background modes required? Documented + justified for App Review?
- [ ] Energy cost understood? Profiled before ship?
- [ ] Offline behavior defined?
- [ ] Platform-specific UX (HIG for iOS, Material for Wear)?
- [ ] Review guidelines read (Apple §4.5, Play policies)?

## Integration catalog (starters)

- **HealthKit** (iOS) / **HealthConnect** (Android) — Workout APP baseline
- **Widgets** — WidgetKit + Glance
- **App Intents** (iOS) / **App Actions** (Android) — Siri, Spotlight,
  Assistant
- **Live Activities / ActivityKit** — iOS in-progress state
- **Watch / Wear OS** — companion app, complications
- **CarPlay / Android Auto** — limited UX, strict templates
- **Shortcuts** — discoverable actions, voice-triggerable

## Delegation

Invoked by `technical-director` or `product-manager` when shipping a
platform integration.
