---
description: Path-scoped rules for Kotlin / Android code.
globs: src/android/**/*.kt, src/**/*.kt
alwaysApply: false
---

# Kotlin / Android Code Rules

- Kotlin 2.x (K2) — no legacy constructs. Explicit types on public APIs.
- Jetpack Compose in new UI. Views only for legacy or library interop.
- StateFlow for hot UI state; SharedFlow for events; cold Flow for pipelines.
- `collectAsStateWithLifecycle()` in composables, not `collectAsState()`.
- `Dispatchers.IO` / `Default` explicit; no suspend on `Main` doing I/O.
- No `GlobalScope`. Ever. Use viewModelScope / lifecycleScope / Hilt scopes.
- Hilt for DI unless project chose Koin — one, not both.
- EncryptedSharedPreferences / DataStore for local prefs. No
  SharedPreferences in new code for anything sensitive.
- Room + SQLDelight for DB. DataStore for simple prefs.
- Compose stability: `@Immutable` / `@Stable` on model types used as
  composable params.
- Min SDK justified and documented. Don't bump without an ADR.
- `@Preview` with `@PreviewScreenSizes`, `@PreviewFontScale`, `@PreviewLightDark`.
- Accessibility: `Modifier.semantics`, min touch target 48dp.
- Baseline Profiles shipped. Macrobenchmark job in CI.
