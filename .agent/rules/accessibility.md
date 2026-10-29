---
description: Path-scoped rules for accessibility. Applies to all UI code.
globs: src/**/*.swift, src/**/*.kt, src/**/*.tsx, src/**/*.dart, src/**/ui/**
alwaysApply: false
---

# Accessibility Rules

- Every interactive element has an accessibility label describing intent,
  not implementation. "Log workout" not "Button".
- Minimum tap target: 44×44 pt (iOS) / 48×48 dp (Android).
- Contrast: text ≥ 4.5:1 (normal), ≥ 3:1 (18pt+). Status not conveyed by
  color alone.
- Dynamic Type / font scale: render at 200% / XXL without clipping or
  overflow.
- Reading order matches visual order. Custom controls declare their
  traits / semantics.
- Reduce motion honored. Heavy animations become crossfade or none.
- Video / voice content has captions or transcripts.
- Haptic alternatives for audio-only cues. Audio alternatives not
  required for haptic-only cues but preferred.
- Forms: label associated with field; error text announced to screen
  readers; no color-only error state.
- `#Preview` / `@Preview`: at least one variant with largest font scale.
- Snapshot tests cover accessibility states.
