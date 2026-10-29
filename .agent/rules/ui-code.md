---
description: Path-scoped rules for UI / design-system component code.
globs: src/**/ui/**, src/**/components/**, src/**/designsystem/**
alwaysApply: false
---

# UI Code Rules

- Tokens: color / typography / spacing / radius / elevation / motion via
  theme, not hardcoded.
- Components stateless where possible; state hoisted to caller or
  ViewModel.
- Every component documents: variants, states (default, loading, empty,
  error, pressed, disabled, focus), platform notes.
- Snapshot / golden tests per variant × state × theme × font scale.
- Dark mode parity from day one, not a follow-up.
- Accessibility baked in: labels, focus order, traits, semantics — tests
  enforce presence.
- Platform fidelity: iOS components follow HIG; Android follow Material 3;
  cross-platform maps to both correctly.
- No business logic in component files.
- No network calls inside components.
- Motion uses theme tokens (duration, easing), not magic numbers.
