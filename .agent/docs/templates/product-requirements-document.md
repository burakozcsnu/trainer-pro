# Product Requirements Document — <feature name>

**Status:** draft | approved | shipped | archived
**Owner:** @product-manager
**Last updated:** YYYY-MM-DD
**Linked pillar(s):**
**Linked UX spec:**
**Linked ADR(s):**

---

## 1. Problem

One paragraph. Stated from the user's point of view. What pain exists
today? Who feels it, and how often?

## 2. User

Which persona is this for? Link to `persona-sheet.md`. How often does
this user hit this problem?

## 3. Job to be done

"When I ___, I want to ___, so I can ___."

## 4. Today

What does the user do today to handle this? Workaround? Competitor app?
Give up?

## 5. Scope — what's in

- Must-have capability 1
- Must-have capability 2

## 6. Non-goals — what's explicitly out

- Thing we're NOT doing in this phase
- Thing that sounds related but isn't

## 7. UX

- Primary flow: link to `design/ux-spec/<screen>.md`
- States covered: loading, empty, error, partial, offline, success
- Accessibility notes

## 8. Acceptance criteria

Observable, testable. At least 3.

- [ ] When the user taps _X_, _Y_ happens within _N_ ms.
- [ ] If _condition_, the app shows _message_ with action _Z_.
- [ ] …

## 9. Analytics

| Event | Fires when | Properties | Success metric |
|---|---|---|---|
| `feature_xyz_started` | User opens flow | source | start_rate |
| `feature_xyz_completed` | User finishes | duration_s | completion_rate ≥ 60% |

## 10. Rollout plan

| Gate | % users | Duration | Decision |
|---|---|---|---|
| Internal | dogfood | 1 week | perf + crashes green |
| Beta | 10% | 1 week | primary metric no regression |
| 50% | 50% | 1 week | guardrails green |
| 100% | 100% | — | ship |

## 11. Risks + mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| SDK approval pending | H | Flag behind `ff_new_feature`; OFF until SDK approved |
| Backend load spike | M | Rate-limit + caching |

## 12. Open questions

- Q1:
- Q2:

## Change log

- YYYY-MM-DD (@author): initial draft
- YYYY-MM-DD (@author): scope trim after estimate
