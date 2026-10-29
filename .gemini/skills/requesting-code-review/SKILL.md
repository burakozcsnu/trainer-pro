---
name: requesting-code-review
description: "Prepare a change for code review — self-review checklist, PR description, test evidence, and reviewer selection. Adapted from obra/superpowers."
argument-hint: "[pr-or-branch-name]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit, Bash
---

# Requesting Code Review

Before you ask a human to look at your change, do the self-review. The
reviewer's time is more expensive than yours in this loop.

## Self-review checklist (mobile)

### Scope
- [ ] The diff does what the PR title says, and nothing else
- [ ] No unrelated reformatting in product files
- [ ] No commented-out code
- [ ] No TODO without a linked ticket

### Correctness
- [ ] Acceptance criteria from the story / PRD met
- [ ] Tests cover the new behavior (unit + component + one UI path)
- [ ] Snapshot tests updated + reviewer-friendly (small, labeled)
- [ ] Ran against the device matrix for affected surfaces

### Platform fit
- [ ] iOS — builds clean, no new deprecated API warnings
- [ ] Android — minSdk compatible, no new R8 warnings
- [ ] RN / Flutter — no bridge regressions, no bundle size spike > 50KB

### Non-functional
- [ ] Analytics event fires with documented properties
- [ ] Accessibility labels present + focus order sane
- [ ] Empty/error/offline states behave
- [ ] Perf: no new main-thread work

### Hygiene
- [ ] PR description follows template
- [ ] Linked to story + PRD
- [ ] Screenshots for UI changes (light + dark + max-font)
- [ ] Risk assessment honest (none / low / medium / high)

## PR description template

```
## What
1-2 sentences. What's different after merging?

## Why
Linked story / PRD.

## How (optional)
If the approach is non-obvious, explain in 3 bullets.

## Test plan
- Manual: flow X on iOS 18 and Android 14, both light + dark
- Automated: unit + snapshot + UI test added

## Screenshots
[attach]

## Risk
Medium — touches auth; flagged behind `new_auth_v2`.

## Analytics
Events: `auth_signed_in_v2` with properties {method, duration_ms}
```

## Reviewer selection

- **Platform specialist** (ios-, android-, rn-, flutter-) for idiom review
- **lead-mobile-engineer** for architecture concerns
- **security-lead** if the diff touches auth/money/PII
- **design-director** if visual changes are significant

## Delegation

Any engineer before asking for review.
