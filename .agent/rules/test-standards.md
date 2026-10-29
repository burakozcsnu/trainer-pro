---
description: Path-scoped rules for tests — unit, snapshot, UI, E2E.
globs: **/*Tests.*, **/*.test.ts, **/*.test.tsx, **/*_test.kt, **/*Test.kt, **/test/**, **/tests/**
alwaysApply: false
---

# Test Standards

- Unit tests cover business logic; no network, no file I/O, no platform
  APIs in unit tests.
- Snapshot / golden tests cover component rendering — per variant ×
  state × theme × font scale.
- UI / E2E tests cover critical flows only (onboarding, auth, core loop,
  payment). Too slow for wide coverage.
- Test names describe behavior: `signs_in_with_valid_credentials`, not
  `test1`.
- Arrange / Act / Assert structure visible in every test.
- No `sleep`-based timing — use test clocks, virtual time, or explicit
  synchronization.
- Flaky test (> 2% failure without code change) → quarantine → fix in
  2 weeks or delete.
- No conditional skips without a linked ticket and expiry date.
- Coverage signal over target: trends matter more than a percent floor.
- Every new P0/P1 bug fix ships with a regression test.
