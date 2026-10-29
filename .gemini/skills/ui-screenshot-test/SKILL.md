---
name: ui-screenshot-test
description: "Set up or review snapshot / golden / screenshot tests for UI components: per-platform tooling, variant × state matrix, CI integration, and diff review workflow."
argument-hint: "[component-name or 'setup']"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit, Bash
---

# UI Screenshot Test

## Per-Platform Tooling (2026)

- **SwiftUI**: swift-snapshot-testing library + `#Preview` variants
- **Compose**: Paparazzi or Roborazzi (JVM-based), Screenshot Testing Tool
- **React Native**: `@storybook/react-native` + Chromatic, OR `react-native-
  view-shot` + custom harness
- **Flutter**: built-in `flutter test --update-goldens`

## Matrix (per component)

For every component variant:
- Light + Dark mode
- Default locale + 1 RTL locale (if shipped)
- Default font scale + Max (XXL / 200%)
- Default state + Error + Loading + Empty (if states apply)

## Workflow

1. Component author writes golden test alongside implementation.
2. PR adds or modifies goldens; reviewer inspects diffs visually.
3. CI fails if unreviewed diffs land on main.
4. Goldens live in-tree, not in LFS (too big → revisit compression).

## Review Rules

- Every golden change gets a human reviewer.
- Reason for the change goes in the PR description.
- "Updated goldens" with no other code change = suspicious; review carefully.

## Setup Commands

```bash
# iOS + Swift Package
.package(url: "https://github.com/pointfreeco/swift-snapshot-testing", from: "1.17.0")

# Android + Roborazzi
# in build.gradle.kts:
# implementation("io.github.takahirom.roborazzi:roborazzi-compose:<v>")

# Flutter
# no extra dep — `flutter test` handles goldens
```

## Delegation

Owned by `ui-engineer`. Coordinates with `qa-lead`.
