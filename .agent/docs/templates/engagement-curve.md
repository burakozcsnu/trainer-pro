# Engagement Curve — <app name>

**Owner:** @product-manager + @data-lead
**Last updated:** YYYY-MM-DD

---

## The curve we want

X axis: days since install. Y axis: % of users still active.

```
100% │█
     │█ ▃
     │█ ▇ ▃
 60% │█ ▇ ▆ ▃ ▃
     │█ ▇ ▆ ▅ ▄ ▃
     │█ ▇ ▆ ▅ ▄ ▃ ▂ ▂ ▂ ▂ ▂ ▂ (plateau = habit)
     └───────────────────────────→ days
       0  1  3  7  14 30 60 90
```

## Stage definitions

| Stage | Window | Target |
|---|---|---|
| Activation | D0 | completed first core action |
| Habit | D7 | 3+ core actions in last 7d |
| Retention | D30 | active at D30 |
| Plateau | D90+ | stable curve |

## Drop-off diagnostics

| Drop-off | Likely cause | Investigation |
|---|---|---|
| D0 → D1 > 60% | Onboarding friction | Funnel events + session recordings |
| D7 → D30 > 50% | Value not recurring | Retention cohort by feature usage |
| D30 → D90 > 30% | Boredom / completeness | Content pipeline / progression |

## Current vs. target

| Stage | Current | Target | Gap |
|---|---|---|---|
| Activation | 42% | 60% | -18pp |
| D7 | 25% | 35% | -10pp |
| D30 | 12% | 20% | -8pp |

## Bets to close gaps

- Bet 1: shorter onboarding (owner, metric, duration)
- Bet 2: streak mechanic (owner, metric, duration)
- Bet 3: …
