---
name: ab-test-plan
description: "Draft a rigorous A/B experiment plan: hypothesis, primary metric, guardrail metrics, assignment unit, sample size, stop rules. Writes a pre-registered doc before any traffic flows."
argument-hint: "[experiment-name]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit
---

# A/B Test Plan

## Required sections

A pre-registered plan avoids post-hoc rationalization. Every section is
mandatory.

### 1. Hypothesis
"If we [change X], then [metric Y will move by Z] because [mechanism]."

Example: "If we shorten onboarding from 6 steps to 3, then D1 activation
will increase by +3pp because fewer drop-offs per step compound."

### 2. Primary metric
One metric. Definition + SQL link + owner.

### 3. Guardrail metrics
Metrics the experiment must NOT regress:
- Retention D7
- Revenue per user (if monetized)
- Crash-free sessions
- Rating

### 4. Assignment unit
- User (user_id hashed) — default
- Session — for low-signal within-user changes
- Install — for onboarding experiments

### 5. Variants
- Control: current experience
- Treatment A: ...
- (Treatment B if needed — don't split further than necessary)

### 6. Exposure
When does the user enter the experiment?
- Exposure event: `exposed_<exp_name>` with variant property

### 7. Sample size
MDE × variance → required n per variant.
Traffic % → days-to-significance estimate.

### 8. Stop rules
- Positive: primary metric +Z with 95% confidence, guardrails green → ship
- Negative: primary metric -Z with 95% confidence → revert, document learning
- Inconclusive: after 4 weeks → decision meeting

### 9. Duration cap
Maximum 4 weeks. Anything longer means low traffic or small MDE — fix before running.

### 10. Rollout plan
If treatment wins: ship to 100% within 2 weeks.
If both ok: keep the simpler.

## Output

Write `data/experiments/<YYYY-MM>-<name>.md` with all sections populated.
Get sign-off from `data-lead` before flipping the flag on.

## Delegation

Owned by `data-lead`. Implementation by `live-ops-manager` +
`analytics-engineer`.
