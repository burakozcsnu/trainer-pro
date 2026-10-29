---
name: test-driven-development
description: "Practice Test-Driven Development with discipline: RED-GREEN-REFACTOR. Write the failing test first, make it pass with the minimum change, then refactor under green bars. Prevents speculation and cuts debug time."
argument-hint: "[feature-or-bug]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit, Bash
---

# Test-Driven Development

Adapted from [obra/superpowers](https://github.com/obra/superpowers).

## The Discipline

1. **RED** — write a test that describes the behavior you want. Run it.
   Confirm it fails for the expected reason.
2. **GREEN** — write the minimum code that makes it pass. Do not polish.
3. **REFACTOR** — clean up under green bars. Tests stay green throughout.

## Anti-Patterns (reject)

- Writing the test AFTER the code "to have coverage" — it's a different
  activity; call it what it is.
- Writing a test that passes on first run — didn't watch it fail, so
  you don't know it actually tests what you think.
- Writing five tests and one giant change — you lose the step-by-step
  safety net.
- Testing implementation instead of behavior — brittle, rewrites on
  refactor.

## For Mobile Specifically

- **Unit**: business logic, pure functions, reducers, formatters.
- **Component / widget**: snapshot tests for rendering; behavior tests
  for interaction.
- **Integration**: module boundaries (network + cache, persistence layer).
- **UI / E2E**: only for critical user flows. Too slow for TDD loop.

## Loop Cadence

- 2-5 minutes per red-green-refactor cycle
- If you're stuck > 10 min, the test is too big — split it.
- Commit after each green (optional but powerful for bisect).

## When NOT TO TDD

- Exploring an API, spiking a library — you're researching, not specifying.
- UI experimentation — Figma/Preview iteration is faster.
- One-line obvious changes — a test to "cover" a typo-fix is noise.

## Delegation

Any engineer. Invoke this skill when starting a story whose behavior is
non-trivial.
