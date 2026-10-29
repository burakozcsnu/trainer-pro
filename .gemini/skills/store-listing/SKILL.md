---
name: store-listing
description: "Draft a complete store listing for App Store Connect and Google Play Console: name, subtitle, description, keywords, promotional text, screenshots spec, and feature-graphic spec."
argument-hint: "[market-code or 'default']"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit
---

# Store Listing

Writes a complete store listing draft for a market. Hand-off ready for
paste into App Store Connect / Play Console.

## Output

`design/growth/store-listing-<market>.md`:

### iOS App Store

```yaml
app_name: "AppName"                     # 30 chars max
subtitle: "Value prop in 5 words"       # 30 chars max
promotional_text: "Changeable anytime"  # 170 chars
description: |
  [FIRST 3 LINES — visible without 'more']
  The hook. What the app does. For whom.

  [Body — max ~4000 chars]
  - Feature 1 with benefit
  - Feature 2 with benefit
  ...

  [Proof]
  - "Quote from user / press"
  - 4.8 stars from 12k ratings
keywords: "keyword1,keyword2,...,keyword10"  # 100 chars, comma, no space
support_url: "https://app.example/support"
marketing_url: "https://app.example"
privacy_policy_url: "https://app.example/privacy"
```

### Google Play Store

```yaml
app_name: "AppName"                     # 30 chars max
short_description: "Value prop"         # 80 chars max
full_description: |
  [First paragraph is what shows in search results]
  Keyword-dense but human-readable.

  [Sections with emoji headers if on-brand]
  🔥 FEATURE — description
  💪 FEATURE — description
  📈 FEATURE — description

  [Social proof]
  [Call to action]
feature_graphic: "1024×500 PNG, brand-on, minimal text"
screenshots:
  - phone: 8 shots (16:9 or taller)
  - tablet: 4 shots if tablet-supported
  - wear: if Wear OS supported
promo_video: "YouTube URL, 30s max"
```

## Copy principles

- First 3 lines / first paragraph IS the pitch — most users don't expand
- Keyword stuffing gets rejected (Play) / ignored (Apple)
- Never claim "best", "#1", superlatives (Apple rejects)
- Include social proof when you have it
- Localize for top markets — machine translation won't convert

## Delegation

Owned by `aso-specialist`. Voice review by `content-director`.
Translations by `localization-lead`.
