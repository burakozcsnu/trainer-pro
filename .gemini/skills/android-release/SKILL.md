---
name: android-release
description: "Drive an Android release from tag to Play Store submission via Fastlane: build AAB, upload to internal track, promote to production, configure staged rollout, and register release artifacts."
argument-hint: "[version]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit, Bash
---

# Android Release

End-to-end flow for cutting and shipping an Android release candidate.

## Prereqs

- Fastlane + `supply` configured; service account JSON accessible to CI
- Upload key stored in CI secret manager (not repo)
- `/store-submit <version>` passed

## Steps

1. **Verify clean tree + on main**.

2. **Bump `versionCode` (monotonic) + `versionName`** in
   `app/build.gradle(.kts)`.

3. **Tag the release**
   ```bash
   git tag -a v<version> -m "Release <version>"
   git push origin v<version>
   ```

4. **Build via Fastlane**
   ```bash
   bundle exec fastlane android release version:<version>
   ```
   Lane should: run tests → assemble release → bundle (AAB) → upload
   mapping.txt to Crashlytics → `supply` upload to internal track.

5. **Promote through tracks**
   - Internal → Closed → Open → Production, minimum 24h soak at each
   - Read pre-launch report before promoting to Production
   - Production: Staged rollout at 10% → 50% → 100% over ~1 week

6. **Archive**
   ```bash
   mkdir -p production/releases/v<version>
   cp app/build/outputs/bundle/release/*.aab production/releases/v<version>/
   cp app/build/outputs/mapping/release/mapping.txt production/releases/v<version>/
   ```

## Rollback Readiness

- Halt staged rollout immediately via Play Console if crash or ANR spikes
- Flag off risky features via remote config
- Hotfix path: cherry-pick → new `versionCode` → expedited track
- **Never lose the upload key** — no Play Integrity means app re-list

## Delegation

Owned by `release-manager`. Build infrastructure by `devops-lead`.
