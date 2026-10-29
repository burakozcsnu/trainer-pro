# A/B Test Spec — <experiment name>

**Status:** pre-registered | running | decided
**Owner:** @data-lead
**Implementer:** @engineer
**Created:** YYYY-MM-DD
**Scheduled:** YYYY-MM-DD → YYYY-MM-DD (4-week cap)

---

## Hypothesis

If we _[change X]_, then _[metric Y]_ will _[move by Z]_ because
_[mechanism]_.

## Primary metric

Name: _metric_name_
Definition: _SQL / formula / source_
Direction: increase / decrease
Minimum detectable effect (MDE): _X%_

## Guardrail metrics

- Retention D7 — must not regress by > _X%_
- Revenue per user — must not regress by > _X%_
- Crash-free sessions — must stay ≥ 99.5%
- Rating — must not drop > 0.1

## Assignment

- Unit: user | session | install
- Method: hashed `user_id % 100 < N`
- Persistence: sticky per user across sessions

## Variants

| Variant | % traffic | Description |
|---|---|---|
| Control | 50 | current experience |
| Treatment A | 50 | _[change]_ |

## Exposure event

- Event: `exposed_<experiment_key>`
- Properties: `{ variant, user_id_hash, assigned_at }`
- Fires: when user SEES the variant, not when assigned

## Sample size

Required n per variant: _N_
Expected traffic: _X users/day_
Expected duration: _D days_

## Stop rules

- **Positive**: primary metric +MDE with 95% confidence AND guardrails
  green → ship treatment
- **Negative**: primary metric -MDE with 95% confidence → revert,
  document learning
- **Guardrail regression**: any guardrail red → halt experiment
- **Inconclusive at 4 weeks**: decision meeting

## Rollout plan (if treatment wins)

- Week 1: 50% → 100%
- Week 2: monitor + cleanup (remove control path, delete flag)

## Results (fill after decision)

- Primary metric delta: _+/- X%_ (95% CI: _..._)
- Guardrails:
- Decision: ship / revert / iterate
- Learnings:
