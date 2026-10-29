# Coding Standards

Path-scoped rules live in `.agent/rules/*`. This doc is the overview.

## Universal

- Every public type, function, or module has a doc comment stating
  purpose and usage. No comments that restate the obvious.
- No dead code. Commented-out code is removed before PR.
- `TODO` without a ticket id is not allowed.
- Error handling: fail loud in dev; fail safe + logged in prod. Never
  swallow silently.
- No secrets, keys, or tokens in source.
- Tests live next to code they cover.

## Per-platform

- Swift: see `.agent/rules/swift-code.md`
- Kotlin: see `.agent/rules/kotlin-code.md`
- TypeScript: see `.agent/rules/typescript-code.md`
- Dart: see `.agent/rules/dart-code.md`
- Backend: see `.agent/rules/backend-code.md`

## Cross-cutting

- UI components: `.agent/rules/ui-code.md`
- Networking: `.agent/rules/network-code.md`
- On-device ML: `.agent/rules/ai-code.md`
- Accessibility: `.agent/rules/accessibility.md`
- Privacy + security: `.agent/rules/privacy-security.md`
- Data / config files: `.agent/rules/data-files.md`
- Tests: `.agent/rules/test-standards.md`
- Prototypes: `.agent/rules/prototype-code.md`
- Product docs: `.agent/rules/product-docs.md`

## Review gates

- Lint clean (platform linter + project linter)
- Tests green
- Screenshot diffs reviewed
- Analytics events verified
- Performance budget not regressed
- Accessibility checks pass
