---
description: Path-scoped rules for product specs (PRDs, pillars, user journeys, feature design docs).
globs: design/**/*.md, docs/product/**/*.md
alwaysApply: false
---

# Product Docs Rules

- Every PRD uses the full template sections: Problem, User, JTBD, Today,
  Scope, Non-goals, UX, Acceptance, Analytics, Rollout, Risks.
- Acceptance criteria are observable and testable. Present tense, not
  narrative.
- Every feature ships with an analytics event spec. No orphan features.
- Non-goals explicit. A PRD without non-goals is incomplete.
- Every product decision traces to a pillar. If it doesn't, either
  document it as an exception OR revisit the pillar.
- Links: PRDs link to ux-spec; stories link to PRD; ADRs link to PRDs
  they support.
- Updates: version the PRD (`prd-name-v2.md`) when scope changes
  post-approval; don't rewrite history.
- Status tags: `draft` / `approved` / `shipped` / `archived` in the
  frontmatter.
