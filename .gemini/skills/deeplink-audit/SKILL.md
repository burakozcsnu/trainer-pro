---
name: deeplink-audit
description: "Audit deep-link coverage and correctness across iOS Universal Links, Android App Links, and custom URL schemes. Catches broken routes, wrong fallbacks, and missing associated-domains config."
argument-hint: "[no arguments]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit, Bash
---

# Deeplink Audit

Deep links are where most mobile apps quietly regress. This audit checks
that every advertised link opens the app and lands on the right screen.

## Phase 1 — Inventory

Collect every URL the app is supposed to open:
- Marketing page CTAs
- Email campaigns
- Push notification payloads
- Referral + share flows
- In-app WebView → native jumps

Output a table:
```
| URL pattern                     | Expected route           | Owner    |
|---------------------------------|--------------------------|----------|
| /workout/:id                    | WorkoutDetail(id)        | @alice   |
| /programs/:slug                 | ProgramDetail(slug)      | @bob     |
| /share/?code=*                  | ReferralLanding          | growth   |
```

## Phase 2 — Config check

### iOS Universal Links
- [ ] `Associated Domains` entitlement includes `applinks:yourdomain.com`
- [ ] `apple-app-site-association` file served at
      `https://yourdomain.com/.well-known/apple-app-site-association`
- [ ] Correct `appID` (TeamID.bundleID) in the file
- [ ] Paths array matches the app's routes

### Android App Links
- [ ] `AndroidManifest.xml` intent filters with
      `android:autoVerify="true"`
- [ ] Digital Asset Links file at
      `https://yourdomain.com/.well-known/assetlinks.json`
- [ ] `sha256_cert_fingerprints` matches both release AND upload key
- [ ] `verify` result clean: `adb shell pm get-app-links com.example.app`

## Phase 3 — Behavioral test matrix

For each URL pattern, test all combinations:

| Scenario | iOS result | Android result |
|---|---|---|
| Cold start from link | → right screen | → right screen |
| Warm start from link | → right screen | → right screen |
| Background → foreground from link | → right screen | → right screen |
| App NOT installed | → App Store / Play | → Play Store |
| User signed out | → sign-in → original link | → same |
| Account mismatch | → disambiguation UX | → same |

## Phase 4 — Report

Write `production/deeplinks/<YYYY-MM-DD>-audit.md` with:
- Inventory
- Config status (pass / fail per item)
- Behavioral test results
- Recommended fixes

## Delegation

Owned by `growth-engineer`. Config changes may require `devops-lead`
(backend for AASA / assetlinks hosting).
