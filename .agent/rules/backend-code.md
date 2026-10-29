---
description: Path-scoped rules for backend code supporting the mobile app.
globs: backend/**/*, server/**/*, functions/**/*
alwaysApply: false
---

# Backend Code Rules

- Typed contract first: OpenAPI 3 or GraphQL SDL or tRPC — generate the
  mobile client from the spec, never hand-write.
- URL or header versioning (`/v1/` or `Accept-Version`). Pick one, stick
  with it. Shipped versions are immutable.
- Errors: RFC 7807 problem+json or a stable `{ code, message, details }`
  shape. Never raw 500 HTML.
- Pagination: cursor-based always. Never offset for user-facing lists.
- Idempotency-Key header required on POST for money / state-changing
  writes.
- Auth: OAuth 2.0 / OIDC. PKCE for mobile. Short access tokens (≤15 min)
  + rotating refresh. Revocation endpoint works.
- RLS or explicit tenant checks on every multi-tenant query.
- Migrations via a real tool (Prisma Migrate / Drizzle Kit / Atlas /
  Flyway). Every migration has a downgrade story.
- Structured JSON logs with request id propagated from the mobile client.
- Tracing end-to-end with a single trace id across edge → fn → DB.
- Rate limits: documented, returned in `Retry-After` header on 429.
- Secrets: env-injected at runtime. No secrets in repo or container image.
- Tests: one integration test per endpoint covers happy + 4xx + 5xx paths.
