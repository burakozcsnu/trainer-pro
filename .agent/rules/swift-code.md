---
description: Path-scoped rules for Swift / iOS code.
globs: src/ios/**/*.swift, src/**/*.swift
alwaysApply: false
---

# Swift / iOS Code Rules

- Swift 6 strict concurrency ON. No `nonisolated(unsafe)` without a
  comment justifying the unsafety.
- `@MainActor` at screen/viewmodel entry points; NOT scattered inside.
- Prefer `@Observable` + `@Environment` over `@EnvironmentObject` /
  `@StateObject` in new code.
- SwiftUI over UIKit in new UI code. Drop to UIKit only for pain points
  (fine-grain UIScrollView, camera, legacy frameworks).
- No `DispatchQueue.main.async` as a concurrency shim — use
  `await MainActor.run` or hoist to `@MainActor`.
- No singletons holding mutable app state; inject via `@Environment`.
- Keychain for tokens. Never `UserDefaults` for secrets.
- Files > 400 lines: split. Types > 100 lines in one file: review.
- Every public type has a doc comment.
- `#Preview` per state on every new View.
- Accessibility: `.accessibilityLabel`, `.accessibilityHint`,
  `.accessibilityAddTraits` set on interactive elements.
- Tests alongside code: `Foo.swift` + `FooTests.swift`.
