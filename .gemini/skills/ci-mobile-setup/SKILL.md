---
name: ci-mobile-setup
description: "Bootstrap mobile CI from scratch: lint + test + build + distribute lanes for iOS, Android, and cross-platform. Writes .github/workflows/ and fastlane/Fastfile with reproducible pinned toolchains."
argument-hint: "[no arguments]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit, Bash
---

# CI Mobile Setup

Spins up a mobile CI pipeline that a team of 1 or 10 can rely on.

## What gets written

```
.github/workflows/
  ios-ci.yml         # lint + test + build on PR + main
  android-ci.yml     # same, for Android
  rn-ci.yml / flutter-ci.yml   # if cross-platform stack
  beta.yml           # nightly beta distribution
  release.yml        # manual, on tag
fastlane/
  Fastfile           # lanes: test, ui_test, beta, release, screenshots
  Appfile            # app identifier + team
  Matchfile          # cert management
.ruby-version        # pin Ruby
Gemfile              # pin Fastlane + plugins
.nvmrc / .tool-versions  # pin Node / Flutter
```

## Principles

- **Toolchain pinned in repo** — no "latest". Ruby version, Xcode version
  env var (`DEVELOPER_DIR`), Node/Flutter version, Gradle wrapper.
- **Caches**: Gradle, CocoaPods, npm, FVM — but with stable keys based on
  lockfile hashes.
- **Secrets in CI only** — no cleartext in repo. Match uses encrypted repo
  for iOS certs; Android keystore stored as base64 CI secret.
- **Artifacts uploaded** — IPA / AAB / symbols / junit xml always, so even
  on failure there's something to look at.

## Reference iOS workflow (GitHub Actions)

```yaml
name: iOS CI
on:
  pull_request: { branches: [main] }
  push:         { branches: [main] }
jobs:
  test:
    runs-on: macos-14
    env:
      DEVELOPER_DIR: /Applications/Xcode_16.2.app/Contents/Developer
    steps:
      - uses: actions/checkout@v4
      - uses: ruby/setup-ruby@v1
        with: { bundler-cache: true }
      - uses: actions/cache@v4
        with:
          path: Pods
          key: pods-${{ hashFiles('Podfile.lock') }}
      - run: bundle exec fastlane test
      - uses: actions/upload-artifact@v4
        with: { name: junit, path: fastlane/report.xml }
```

## Reference Android workflow

```yaml
name: Android CI
on:
  pull_request: { branches: [main] }
  push:         { branches: [main] }
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { java-version: 17, distribution: temurin }
      - uses: android-actions/setup-android@v3
      - uses: gradle/actions/setup-gradle@v3
      - run: ./gradlew lint testReleaseUnitTest
      - uses: actions/upload-artifact@v4
        with: { name: test-reports, path: '**/build/reports/tests' }
```

## Delegation

Owned by `devops-lead`. Implementation by `devops-engineer`.
