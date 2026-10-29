# Technical Preferences

This file is the ground truth for the tech stack decisions in this
project. Populated by `/setup-platform` at project start; edited via
ADRs afterwards.

---

## Platform(s)

- [ ] iOS
- [ ] Android
- [ ] iPadOS
- [ ] Wear OS / watchOS

## Approach

- [ ] Native iOS + Native Android (separate codebases)
- [ ] React Native + Expo (shared TS codebase)
- [ ] Flutter (shared Dart codebase)
- [ ] Native + Kotlin Multiplatform shared core
- [ ] Native + Rust / C++ shared core

## Language(s)

- iOS: _[Swift 6.2]_
- Android: _[Kotlin 2.x]_
- RN: _[TypeScript strict]_
- Flutter: _[Dart 3.x]_
- Backend: _[TypeScript / Kotlin / Go / Python]_

## Minimum OS versions

- iOS: _[iOS 17]_
- Android: _[API 26 / Android 8.0]_

## Build system

- iOS: _[Xcode 16 + SPM]_
- Android: _[Gradle KTS + Version Catalogs + KSP]_
- RN: _[EAS Build + Expo SDK 52+]_
- Flutter: _[FVM + Melos]_

## State management

- iOS: _[@Observable + Environment]_
- Android: _[ViewModel + StateFlow + MVI/UDF]_
- RN: _[Zustand / Redux Toolkit + TanStack Query]_
- Flutter: _[Riverpod 2.x]_

## Backend

- [ ] Firebase (Firestore + Auth + Functions + FCM)
- [ ] Supabase (Postgres + Auth + Storage + Edge Functions)
- [ ] Custom + serverless (Cloudflare Workers / Vercel / Fly.io)
- [ ] Full custom (Node / Go / Kotlin on managed containers)
- [ ] Backendless (local-only)

## Third-party SDKs in use

| SDK | Purpose | Approved by | License |
|---|---|---|---|
| RevenueCat | Subscription management | technical-director | MIT |
| Sentry | Crash + perf | technical-director | BSD-3-Clause |
| Amplitude / Firebase Analytics | Analytics | data-lead | commercial |
| _…_ | | | |

## CI / distribution

- Runner: _[GitHub Actions (macos-14 for iOS, ubuntu-latest for Android)]_
- Beta: _[TestFlight + Firebase App Distribution + Play Internal track]_
- Release: _[Fastlane lanes: test, beta, release, screenshots]_

## Feature flags + remote config

- Tool: _[Firebase Remote Config / Statsig / GrowthBook / LaunchDarkly]_
- Experiment platform: _[same tool, or Firebase A/B / Amplitude Experiment]_

## Observability

- Crash: _[Crashlytics + Sentry]_
- Perf: _[Firebase Performance + Sentry Performance]_
- Logs: _[structured JSON; platform-default local + OpenTelemetry for backend]_

## Privacy / compliance posture

- App Privacy Manifest (iOS) maintained
- Play Data Safety form maintained
- GDPR-compliant consent UX
- CCPA data-deletion endpoint
- ATT prompt only if tracking
