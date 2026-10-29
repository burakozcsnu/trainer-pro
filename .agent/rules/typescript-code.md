---
description: Path-scoped rules for TypeScript (React Native, Expo, tooling).
globs: src/**/*.ts, src/**/*.tsx, scripts/**/*.ts
alwaysApply: false
---

# TypeScript Code Rules

- `strict: true` in tsconfig. No `any` in PR-ready code — use `unknown`
  or model the type.
- No default exports for React components (named exports scale better
  with refactors).
- React components as function components only. Hooks for all state.
- `useMemo` / `useCallback` surgically, not sprinkled. Benchmark before
  optimizing.
- RN: `FlashList` over `FlatList` for large lists. Stable `keyExtractor`.
- RN: Reanimated 3 worklets for animation; legacy `Animated` only in
  legacy code.
- Navigation: typed param lists; no prop drilling through navigation.
- State: Zustand or Redux Toolkit (RTK Query for server state) or
  TanStack Query. Pick one per project.
- Forms: React Hook Form + Zod for validation.
- Env vars via `expo-constants` / typed config, never `process.env.X`
  scattered.
- Bundle: tree-shake aware imports. `import { foo } from 'lib'` not
  `import lib from 'lib'`.
- Tests: Jest + React Native Testing Library. Detox or Maestro for E2E.
