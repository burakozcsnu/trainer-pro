---
name: e2e-test
description: "Define or run end-to-end tests using Maestro or Detox. Covers happy path + top 3 error paths per critical flow. Integrates with CI."
argument-hint: "[flow-name or 'setup']"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit, Bash
---

# E2E Test

## Tool Choice (2026)

- **Maestro** — YAML-based, one test script for both iOS and Android,
  lowest friction. Preferred for most apps.
- **Detox** — JS-based, more powerful for RN apps with complex setup.
- **XCUITest + Espresso** — native, heaviest; choose only when platform-
  specific behavior must be tested.

## What to Cover (don't over-test)

- Onboarding happy path
- Core loop happy path
- Authentication (sign-in, sign-out, failed attempt)
- Payment / subscription start (sandbox)
- Deep link landing

**Do NOT** cover: every screen, every edge case. E2E is slow and flaky;
unit + component tests cover width.

## Maestro Example

```yaml
# e2e/flows/onboarding-happy.yaml
appId: com.example.workoutapp
---
- launchApp
- tapOn: "Get Started"
- tapOn:
    id: "email_field"
- inputText: "test@example.com"
- tapOn: "Continue"
- assertVisible: "Welcome to Workout"
```

## CI Integration

- Maestro Cloud for cross-platform runs OR self-hosted emulator/simulator
- PR gating: E2E run on `main`-bound PRs; nightly run on main
- On failure: capture screenshot + video; attach to job

## Flaky Test Policy

- Test that fails > 2% of runs without a code change → quarantine
- Quarantined tests get fixed within 2 weeks or deleted
- No green-washing: if a test is flaky it's not green

## Delegation

Owned by `qa-lead`. Implementation by `qa-tester`.
