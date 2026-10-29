---
name: ios-release
description: "Drive an iOS release from tag to App Store submission via Fastlane: build archive, upload to TestFlight, promote to App Store, configure phased release, and register release artifacts."
argument-hint: "[version]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit, Bash
---

# iOS Release

End-to-end flow for cutting and shipping an iOS release candidate.

## Prereqs

- `fastlane` installed, `match` configured, App Store Connect API key
- `CHANGELOG.md` has an entry for the new version
- `/store-submit <version>` passed

## Steps

1. **Verify clean tree + on main**
   ```bash
   git status && git rev-parse --abbrev-ref HEAD
   ```

2. **Tag the release** (if not already tagged)
   ```bash
   git tag -a v<version> -m "Release <version>"
   git push origin v<version>
   ```

3. **Build archive via Fastlane**
   ```bash
   bundle exec fastlane ios release version:<version>
   ```
   Lane should: run tests → match certs → gym build → upload dSYMs to
   Crashlytics + Sentry → pilot upload to TestFlight.

4. **Wait for TestFlight processing**, then submit to App Store with:
   - Release notes (English + active locales)
   - Privacy manifest confirmed via `store-submit`
   - Phased release **enabled**

5. **Archive release artifacts**
   ```bash
   mkdir -p production/releases/v<version>
   cp build/*.ipa build/*.dSYM* production/releases/v<version>/
   ```

6. **Update roadmap + close milestones**

## Rollback Readiness

- Feature flags for new risky features are OFF. Confirm via remote config
  admin panel.
- If a regression surfaces post-submit but pre-phased-100%:
  - Pause phased release in App Store Connect
  - Flip feature flags OFF
  - Decide fix-forward vs. rollback to previous build
- Expedited review requests: document reason, submit via App Store Connect,
  track in `production/incidents/`.

## Delegation

Owned by `release-manager`. Build infrastructure owned by `devops-lead`.
