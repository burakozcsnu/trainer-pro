# Agent Roster — Batoner Mobile App Studios

**Total: 51 agents**. Tier 1 uses Opus (high reasoning), Tier 2 uses Sonnet
(department leadership), Tier 3 uses Sonnet or Haiku (focused specialists).

## Tier 1 — Directors (4, Opus)

| Agent | Responsibility |
|---|---|
| `product-director` | Product vision, pillars, tone, positioning |
| `technical-director` | Platform strategy, architecture, perf budgets |
| `design-director` | Visual + interaction identity, design system |
| `producer` | Schedule, scope, risk, delivery cadence |

## Tier 2 — Department Leads (12, Sonnet)

| Agent | Responsibility |
|---|---|
| `product-manager` | PRDs, stories, backlog, acceptance |
| `lead-mobile-engineer` | Code architecture, reviews, standards |
| `ux-lead` | Flows, information architecture, interaction patterns |
| `qa-lead` | Test strategy, device matrix, release sign-off |
| `release-manager` | Release pipeline, store submission, rollout |
| `devops-lead` | CI/CD, build infrastructure, signing, distribution |
| `data-lead` | Analytics taxonomy, experimentation, dashboards |
| `growth-lead` | Acquisition, activation, retention, referral |
| `localization-lead` | Locale strategy, translation, RTL |
| `security-lead` | Threat model, privacy, secure storage, compliance |
| `content-director` | Voice, microcopy, in-app + store language |
| `audio-director` | Sound + haptic language (when in scope) |

## Tier 3 — Specialists (35, Sonnet/Haiku)

### Platform leads (4)

| Agent | Platform | Sub-specialists |
|---|---|---|
| `ios-specialist` | iOS / SwiftUI / Swift 6.2 | swiftui, swift-concurrency, swift-persistence |
| `android-specialist` | Android / Jetpack Compose / Kotlin 2.x | compose, coroutines, architecture |
| `react-native-specialist` | RN New Arch + Expo SDK 52+ | new-architecture, expo |
| `flutter-specialist` | Flutter 3.29+ / Dart 3 | riverpod |

### Platform sub-specialists (9)

| Agent | Parent | Focus |
|---|---|---|
| `swiftui-specialist` | ios-specialist | SwiftUI composition, identity, layout |
| `swift-concurrency-specialist` | ios-specialist | Swift 6 strict concurrency, actors |
| `swift-persistence-specialist` | ios-specialist | SwiftData, Core Data, CloudKit |
| `jetpack-compose-specialist` | android-specialist | Compose composition, stability |
| `kotlin-coroutines-specialist` | android-specialist | Coroutines + Flow |
| `android-architecture-specialist` | android-specialist | Modularization, Hilt, Gradle |
| `rn-new-architecture-specialist` | react-native-specialist | Fabric, TurboModules, JSI |
| `rn-expo-specialist` | react-native-specialist | Expo managed, EAS, Expo Router |
| `flutter-riverpod-specialist` | flutter-specialist | Riverpod 2.x state management |

### Cross-cutting engineering (6)

| Agent | Focus |
|---|---|
| `backend-engineer` | Server APIs, auth, database, cloud |
| `mobile-feature-engineer` | End-to-end feature implementation |
| `ai-ml-engineer` | On-device + cloud ML integration |
| `network-engineer` | HTTP, offline sync, sockets, image pipeline |
| `tools-engineer` | Internal tooling, codegen, Fastlane, lints |
| `ui-engineer` | Design-system component implementation |

### Quality + observability (5)

| Agent | Focus |
|---|---|
| `performance-analyst` | Startup, frame rate, memory, battery, size |
| `analytics-engineer` | Event emitter implementation + validation |
| `accessibility-specialist` | WCAG AA, VoiceOver, TalkBack, Dynamic Type |
| `qa-tester` | Test execution, bug reports, exploratory |
| `security-engineer` | MASVS audits, MobSF, pen tests, hardening |

### Design + content (6)

| Agent | Focus |
|---|---|
| `ux-designer` | Screen-level design, ux-spec authoring |
| `motion-designer` | Transitions, Lottie/Rive, reduce-motion |
| `prototyper` | Throwaway prototypes for risky ideas |
| `content-strategist` | Microcopy drafting within voice |
| `community-manager` | Review response, support, crisis comms |
| `sound-designer` | Audio + haptic asset production |

### Growth + ops (5)

| Agent | Focus |
|---|---|
| `live-ops-manager` | Remote config, flags, experiment ops |
| `monetization-analyst` | Pricing, paywalls, LTV, cohort economics |
| `growth-engineer` | Attribution, deep links, push plumbing |
| `aso-specialist` | App Store Optimization |
| `devops-engineer` | CI/CD implementation under devops-lead |

## Coordination map

See `.agent/docs/agent-coordination-map.md` for who escalates to whom
and who delegates to whom.
