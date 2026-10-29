---
name: aso-optimize
description: "Run an ASO cycle: research keywords for the target market, audit current listing (iOS + Play), propose title/subtitle/description/screenshot changes, and set up Product Page Optimization (iOS) / Store Listing Experiments (Play)."
argument-hint: "[market-code e.g. US, DE, TR]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit, WebSearch
---

# ASO Optimize

Generates a complete ASO package for one market.

## Phase 1 — Research

1. Print current metrics (impressions → taps → installs funnel; prompt user
   for numbers if analytics not accessible).
2. Collect top 50 keywords with volume/difficulty/own-rank via ASO tool
   (user-provided export). Rank by opportunity score = volume × relevance /
   difficulty.
3. Audit top 5 competitors: pull their current title, subtitle, screenshots,
   description. Note their keyword strategy.

## Phase 2 — Recommendations

Draft a `design/growth/aso-<market>-v<n>.md` with:

### iOS — App Store
- Title (30 chars): `[App Name]: [keyword hint]`
- Subtitle (30 chars): value prop
- Keywords field (100 chars, comma, no spaces): top keywords not already in
  title/subtitle
- Description: first 3 lines (visible without "more")
- Promotional text (170 chars): changeable without review

### Android — Play Store
- Short description (80 chars)
- Long description: keyword density 2-3% per top keyword, sectioned for
  scannability
- Feature graphic: brief on-brand

### Screenshots (both stores)
- Shot 1: benefit + hook
- Shot 2: core flow
- Shot 3: proof / social / award
- Shots 4-8: secondary features

## Phase 3 — Experiment Plan

- iOS Product Page Optimization: 3 variants, 30d, 90d cool-off between tests
- Play Store Listing Experiments: per-asset, 14-28d depending on traffic

## Output

Write the recommendation doc. Ask the user which variant to run first.
Do NOT publish — hand off to the user for App Store Connect / Play Console
upload.

## Delegation

Owned by `aso-specialist`. Copy review by `content-strategist`.
Translations by `localization-lead`.
