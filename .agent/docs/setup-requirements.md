# Setup Requirements

## Required

- [Git](https://git-scm.com/)
- [Gemini CLI](https://docs.anthropic.com/en/docs/gemini-code):
  `npm install -g @anthropic-ai/gemini-code`

## Recommended by stack

### Native iOS
- Xcode 16+ (Command Line Tools via `xcode-select --install`)
- [Fastlane](https://fastlane.tools): `brew install fastlane`
- [SwiftLint](https://github.com/realm/SwiftLint): `brew install swiftlint`
- [xcbeautify](https://github.com/cpisciotta/xcbeautify): optional,
  prettier `xcodebuild` output

### Native Android
- Android Studio (latest stable)
- JDK 17 (`brew install temurin` or similar)
- [ktlint](https://pinterest.github.io/ktlint/): `brew install ktlint`
- Gradle (included via wrapper; version pinned in `gradle/wrapper/`)

### React Native + Expo
- Node 20+ LTS (use `nvm`)
- [Bun](https://bun.sh) (optional, faster installs)
- `npm install -g eas-cli expo-cli`

### Flutter
- [Flutter SDK 3.29+](https://docs.flutter.dev/get-started/install)
- Optional: [FVM](https://fvm.app) for toolchain pinning
- [Melos](https://melos.invertase.dev) for monorepos

### Cross-cutting
- [Ruby](https://www.ruby-lang.org) (Fastlane dependency) — rbenv or asdf
- [jq](https://jqlang.github.io/jq/) — JSON in shell
- [GitHub CLI](https://cli.github.com): `gh`
- [Maestro](https://maestro.mobile.dev) or [Detox](https://wix.github.io/Detox/)
  for E2E

## Environment variables

Copy `.env.example` (if present) to `.env`; never commit `.env`.

## Optional but helpful

- [direnv](https://direnv.net) for per-project env
- [gum](https://github.com/charmbracelet/gum) for prettier shell scripts
- [lazygit](https://github.com/jesseduffield/lazygit) for faster git
