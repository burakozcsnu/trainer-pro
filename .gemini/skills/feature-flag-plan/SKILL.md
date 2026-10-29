---
name: feature-flag-plan
description: "Plan a new feature flag: owner, purpose, default values per env, expiry date, rollout strategy, cleanup plan. Prevents flag graveyards."
argument-hint: "[flag-name]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit
---

# Feature Flag Plan

## Required fields

```yaml
key:        onboarding_length_v2
owner:      @alice (product-manager)
purpose:    Shorter onboarding experiment (3 vs 6 steps)
created:    2026-04-21
expires:    2026-06-21   # max 60 days
type:       boolean | string | int | json
default_production: false
default_staging:    true
rollout:
  - 2026-04-28: 5%
  - 2026-05-05: 25%
  - 2026-05-12: 50%
  - 2026-05-19: 100%
cleanup:
  - 2026-06-21: Remove flag code, delete remote-config entry, update docs.
  - Verify dead code removed via grep for flag key.
```

## Types of flags

- **Release flag** — new feature rollout; short-lived
- **Experiment flag** — A/B variant assignment; tied to an experiment doc
- **Operational flag** — kill switch for a misbehaving feature; long-lived
- **Permission flag** — user-tier gating; long-lived, part of product

## Rules

- New flags default OFF in production
- Every flag has an expiry; sweep quarterly
- Typed in code (enum), not string lookup
- Default value baked in for offline fallback
- At removal: delete both branches of code, not one

## Output

Write `production/flags/<flag-key>.yaml`. Before setting the flag live,
`live-ops-manager` reviews.

## Delegation

Owned by `live-ops-manager`. Implementation by feature engineer.
