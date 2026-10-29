---
name: writing-plans
description: "Before implementing a non-trivial change, write a plan: list the files that will change, the order of operations, the risky bits, and the verification after each step. Bite-sized, linear, reviewable before work starts."
argument-hint: "[feature-or-change-name]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit, Bash
---

# Writing Plans

Adapted from [obra/superpowers](https://github.com/obra/superpowers).

## Why plans

A plan exists so:
- the user can sign off before work begins
- the implementer (you or a subagent) stays on rails
- when work is interrupted, resumption is fast
- when work fails, the failure is local and reviewable

## Plan template

```markdown
# Plan: <feature / change name>

## Goal
One sentence. Observable outcome.

## Out of scope
What this plan explicitly doesn't do.

## Files
- src/ios/Features/.../FileA.swift (modify)
- src/ios/Features/.../FileB.swift (new)
- src/ios/Tests/.../FileATests.swift (new)

## Steps

### 1. Write failing test for behavior X
- File: FileATests.swift
- Verify: test fails with expected message

### 2. Implement minimum change
- File: FileA.swift, method `foo`
- Verify: test from step 1 passes; sibling tests still green

### 3. Handle error path
- File: FileA.swift
- Verify: new test for error case passes

### 4. Refactor
- Pull repeated logic into helper
- Verify: all tests green, lint clean

## Risks
- R1: Foo currently uses a shared singleton. Might affect Bar.
      Mitigation: grep for singleton callers before modifying.

## Rollback
If mid-way something goes wrong:
- Revert to the last green commit.
- Reopen the plan and adjust.
```

## Rules

- **Bite-sized**: each step is 5-30 minutes of work. If larger, split.
- **Linear**: step N+1 depends on N; don't plan parallel work in one plan.
- **Testable**: every step has a verification.
- **Reversible**: every step has a rollback.

## Output

Write `production/plans/<date>-<name>.md`. Get user sign-off before
invoking `executing-plans`.

## Delegation

Author is usually the engineer who'll implement. Review by
`lead-mobile-engineer` or the responsible platform specialist.
