---
description: Path-scoped rules for Dart / Flutter code.
globs: src/**/*.dart
alwaysApply: false
---

# Dart / Flutter Code Rules

- Dart 3.x with sound null safety. No `!` to shut up the analyzer —
  model nullability properly.
- Flutter 3.29+ with Impeller renderer on both platforms.
- State: Riverpod 2.x (preferred) or Bloc. `setState` only for truly
  local UI state.
- Code-gen Riverpod (`@riverpod` annotation) over manual provider decls.
- `const` constructors everywhere possible — huge rebuild wins.
- `RepaintBoundary` on expensive subtrees; `ListView.builder` for long
  lists.
- Navigation: `go_router` with typed routes.
- Persistence: `drift` for relational; `sembast` for document;
  `flutter_secure_storage` for secrets.
- Networking: `dio` with interceptors; models via `freezed` +
  `json_serializable`.
- Platform channels: `Pigeon` for typed channels; no hand-rolled
  `MethodChannel` in new code.
- Tests: `flutter_test` + `mocktail`; `integration_test` for E2E;
  golden tests for critical UI.
- Melos for monorepos; FVM for toolchain pinning.
- Semantics widgets on custom controls; sufficient contrast + target size.
