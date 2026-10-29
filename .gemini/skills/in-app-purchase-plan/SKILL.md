---
name: in-app-purchase-plan
description: "Plan in-app purchase / subscription architecture: SKU design, receipt validation, entitlement flow, trial logic, family sharing, restore flow, and paywall placement."
argument-hint: "[no arguments]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit
---

# In-App Purchase Plan

Writes the end-to-end IAP spec before any code. Covers both stores and the
server-side entitlement layer.

## 1. Business model

- **Subscription** (monthly / annual / lifetime) — most fitness / media apps
- **One-time** (unlock / consumable) — games, premium features
- **Freemium with paywall** — gated features / content
- **Hybrid** — free with optional subscription for advanced

## 2. SKU design

```yaml
skus:
  - id: pro_monthly
    type: subscription
    duration: 1 month
    price_tier: tier_5 (local currency via StoreKit)
    trial: 7 days
    family_sharing: true

  - id: pro_annual
    type: subscription
    duration: 1 year
    price_tier: tier_49
    trial: 14 days
    promo: "Save 30% vs monthly"
    family_sharing: true

  - id: pro_lifetime
    type: non-consumable
    price_tier: tier_99
    family_sharing: true
```

## 3. Receipt + entitlement flow

Use **RevenueCat** (default) — handles both stores + server entitlement.
Otherwise:

- Client purchase → store returns signed receipt
- Client sends receipt to backend
- Backend validates via Apple / Google server API
- Backend stores active entitlement tied to user
- Client queries entitlement, not receipt directly
- Webhook from RevenueCat or direct S2S notification for renewals /
  cancels / refunds

## 4. Trial logic

- Eligibility: per Apple ID / Google account, not per install
- Inform user clearly (Apple HIG, Play policy requirements)
- Grace period on payment failure (16 days Apple default, 3-30 days Play)
- Downgrade behavior: immediate vs. next billing cycle

## 5. Restore purchases

- Visible button on paywall (Apple requires)
- Triggers `SKPaymentQueue.default().restoreCompletedTransactions()`
  (or StoreKit 2 `AppStore.sync()`) on iOS
- Triggers Billing Library query on Android
- Silent restore on sign-in if user has prior entitlement

## 6. Paywall UX

- Show after value has been delivered (not screen 1)
- 3 tiers max shown at once
- Trial copy honest ("7 days free, then $9.99/mo")
- Annual highlighted with savings %
- Cancel-anytime language prominent

## 7. Analytics

- `paywall_viewed` — entry point + variant
- `paywall_sku_selected` — which tier
- `purchase_started`, `purchase_completed`, `purchase_failed` with reason
- `subscription_renewed`, `subscription_canceled`, `subscription_refunded`
  (via webhook)

## Delegation

Owned by `monetization-analyst`. Implementation by `backend-engineer`
(webhooks, entitlements) + platform specialists.
