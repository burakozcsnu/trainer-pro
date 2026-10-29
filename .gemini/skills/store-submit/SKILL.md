---
name: store-submit
description: "Run the full pre-submission checklist for App Store Connect and Google Play Console before a release. Validates privacy manifest, screenshots, release notes, build metadata, and writes a go/no-go verdict."
argument-hint: "[release-version]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit, Bash
---

# Store Submit

Takes a release candidate version (e.g., `1.4.0`) and runs the checklist
across both stores. Produces a go/no-go verdict.

## Checklist (both stores)

### Technical

- [ ] Release candidate built from a tagged commit on main
- [ ] Crash-free sessions in TestFlight / Internal Track ≥ 99.5% over 48h
- [ ] All P0 / P1 bugs closed; P2 either closed or deferred with sign-off
- [ ] Symbols uploaded (dSYM to Crashlytics + Sentry; Android mapping.txt)
- [ ] Version + build number bumped and unique
- [ ] Feature flags for new features default OFF in production

### Privacy

**iOS**:
- [ ] `PrivacyInfo.xcprivacy` committed and covers every required-reason API
- [ ] App Privacy answers unchanged vs last release (or diff reviewed)
- [ ] ATT prompt text matches approved string
- [ ] "Accessed by third parties" disclosures match SDK tracker list

**Android**:
- [ ] Play Data Safety form matches actual collection
- [ ] POST_NOTIFICATIONS runtime perm handled gracefully
- [ ] Target SDK current (API 35 at time of writing)

### Content

- [ ] Release notes written (EN + active locales)
- [ ] Age rating reviewed for content changes
- [ ] Store screenshots current for each supported device
- [ ] Preview video (iOS) / feature graphic (Play) current
- [ ] Title / subtitle / description in active locales

### Compliance

- [ ] Export compliance (iOS): encryption declaration current
- [ ] Copyright string updated (year + entity)
- [ ] Support URL live
- [ ] Privacy policy URL live + accessible
- [ ] Terms of service URL live (if applicable)

### Distribution

- [ ] Phased rollout % configured (default 1% → 10% → 50% → 100%)
- [ ] Rollback path documented: hotfix branch strategy + flag kill switch

## Output

Write `production/releases/<version>/submission-checklist.md` with each box
ticked or marked `DEFERRED: <reason>`. If any P0 box is unticked, verdict
is NO-GO and the blocker is printed.

## Delegation

Hand off to `release-manager` for final sign-off and submission.
