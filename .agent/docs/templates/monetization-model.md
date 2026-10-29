# Monetization Model — <app name>

**Owner:** @monetization-analyst
**Last updated:** YYYY-MM-DD

---

## Business model

- [ ] Subscription only
- [ ] One-time purchase(s)
- [ ] Freemium with paywall
- [ ] Ad-supported (not recommended for most app categories)
- [ ] Hybrid: _[specify]_

## SKU catalog

| SKU id | Type | Duration | Price tier | Trial | Family sharing |
|---|---|---|---|---|---|
| `pro_monthly` | subscription | 1 month | tier_5 | 7 days | yes |
| `pro_annual` | subscription | 1 year | tier_49 | 14 days | yes |
| `pro_lifetime` | non-consumable | lifetime | tier_99 | — | yes |

## Paywall placement

Where in the funnel does the user see the paywall?

- Contextual (after user hits a gated feature): recommended
- Onboarding step N: higher friction, test carefully
- Settings: for users who find their way there

## Pricing strategy

- Anchor price: annual
- Savings framing: "Save _X%_" on annual vs. monthly
- Localization: StoreKit localized prices, never hand-formatted
- Price test policy: cohort or region, never same-user A/B (store rule)

## Entitlement architecture

- [ ] RevenueCat (default)
- [ ] Direct StoreKit 2 + Play Billing (custom)

Client queries entitlement service, not raw receipts. Backend webhook
handles renewals, cancels, refunds, grace period.

## Success metrics

| Metric | Target | Source |
|---|---|---|
| Trial-to-paid | ≥ 40% | RevenueCat / analytics |
| Annual mix | ≥ 60% of new subs | RevenueCat |
| 1-month retention | ≥ 85% | RevenueCat |
| ARPDAU | target _$X_ | analytics |
| Refund rate | ≤ 2% | RevenueCat |

## Experiments in flight

- Paywall copy A/B (`paywall_copy_v2`), primary: trial-to-paid
- Annual savings framing (`paywall_annual_frame`), primary: annual mix

## Risks

- Store policy changes: monitor, stay in compliance window
- Trial abuse: eligibility check before serving trial
- Refund spike: triage + respond within 48h to user
