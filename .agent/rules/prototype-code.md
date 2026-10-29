---
description: Path-scoped rules for throwaway prototype code.
globs: prototypes/**
alwaysApply: false
---

# Prototype Code Rules

- Prototypes are THROWAWAY. Never merged to product main.
- Each prototype lives in `prototypes/<name>/` with its own README
  stating: hypothesis, status, what was learned, expiry.
- No product dependencies: prototypes can import product modules via
  path reference, product never imports from `prototypes/`.
- Shortcuts are acceptable: magic numbers, hardcoded content, no tests,
  no a11y. The point is speed.
- Before shipping a prototype idea to product: REWRITE it in product
  code with the full quality bar. Don't "productionize" prototype code
  in place.
- Prototypes get deleted once the question is answered. An old
  prototype that's still around is technical debt.
