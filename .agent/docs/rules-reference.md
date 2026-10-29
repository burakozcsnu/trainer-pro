# Rules Reference

Path-scoped rules in `.agent/rules/*.md`. Each rule has a `globs:`
field; Gemini applies the rule when the file being worked on matches.

| Rule | Scope |
|---|---|
| `swift-code.md` | Swift / iOS |
| `kotlin-code.md` | Kotlin / Android |
| `typescript-code.md` | TypeScript / RN / tooling |
| `dart-code.md` | Dart / Flutter |
| `backend-code.md` | Backend services |
| `ui-code.md` | Design-system components |
| `network-code.md` | Networking / sync / offline |
| `ai-code.md` | On-device ML / AI integration |
| `accessibility.md` | All UI — always applies |
| `privacy-security.md` | Auth / payment / identity / privacy |
| `data-files.md` | Config / taxonomy / data files |
| `product-docs.md` | PRDs / pillars / specs |
| `test-standards.md` | Tests of any kind |
| `prototype-code.md` | `prototypes/` only |

## How rules are applied

Rules are advisory to Gemini — they shape suggestions and reviews, not
block. Enforcement happens via:
- Linters (ESLint, ktlint, SwiftLint, etc.)
- Tests
- Pre-commit hooks (`.agent/hooks/validate-commit.sh`)
- Code review agents
