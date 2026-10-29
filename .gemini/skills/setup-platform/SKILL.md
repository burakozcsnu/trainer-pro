---
name: setup-platform
description: "Choose and configure the mobile platform stack for a new project — native iOS + Android, React Native (Expo), or Flutter. Writes .agent/docs/technical-preferences.md, scaffolds the src/ directory, and records the decision as an ADR."
argument-hint: "[no arguments]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit, Bash, AskUserQuestion
---

# Setup Platform

This skill picks the mobile platform stack and writes it down so every
subsequent skill knows where it is.

## Writes

- `.agent/docs/technical-preferences.md` — stack fields populated
- `docs/architecture/adr-000-platform-choice.md` — the reasoning
- `src/GEMINI.md` — stub-pointer to the chosen stack

## Phase 1: Gather Requirements

Ask the user, in order, via `AskUserQuestion`:

### Q1 — Target platforms
- **iOS + Android** (both required)
- **iOS only** (single-platform app)
- **Android only** (single-platform app)

### Q2 — Approach (only if both)
- **Native (iOS + Android separate)** — best fidelity, 2× engineering
- **React Native + Expo** — shared TS codebase, 90% UI shared
- **Flutter** — shared Dart codebase, custom rendering
- **Native + Kotlin Multiplatform shared core** — native UI, shared logic

### Q3 — Team size
- Solo
- 2-3
- 4-10
- 10+

### Q4 — Backend
- BaaS (Firebase)
- BaaS (Supabase)
- Custom + serverless
- Full custom (Node/Go/Kotlin)
- Backendless (local-only)

## Phase 2: Recommend

Based on answers, print the recommended stack and justify — but never
silently commit. Ask the user: "Proceed with [recommendation], or pick
differently?"

## Phase 3: Write Configuration

Update `.agent/docs/technical-preferences.md` with the chosen stack fields
(platforms, language(s), min versions, build system, backend, CI runner,
analytics SDK, crash SDK, feature-flag tool).

Create `docs/architecture/adr-000-platform-choice.md` recording:
- Context, decision, alternatives considered, consequences.

Create platform skeleton:
- iOS native → `src/ios/` with `Package.swift` placeholder
- Android native → `src/android/` with module structure placeholder
- RN + Expo → `npx create-expo-app@latest src/app --template`
- Flutter → `flutter create src/app`

## Phase 4: Hand Off

Print next-step suggestion:
- `/architecture-decision` to record further ADRs
- `/create-architecture` for the master blueprint
- `/ux-design` to start screen work
