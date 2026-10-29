---
name: api-design
description: "Design a typed, versioned API contract for a mobile client: resource shape, error format, pagination, idempotency, auth, and a generated client plan."
argument-hint: "[feature-or-resource]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit
---

# API Design

Design a client ↔ server contract that survives network hostility and
shipped-version drift.

## Required decisions

### 1. Style
- REST (default, simplest)
- GraphQL (when screens need varied projections and fan-in saves round-trips)
- tRPC (when server is TS and mobile is RN/TS only)
- gRPC (internal high-frequency, rarely customer-facing mobile)

### 2. Contract spec
- OpenAPI 3.x for REST
- GraphQL SDL
- tRPC router types
- `.proto` for gRPC
Generate the mobile client from the spec. **Never hand-write it.**

### 3. Versioning
- URL version (`/v1/`) — explicit, simple, default
- Header version (`Accept-Version`) — cleaner URLs, harder to debug
- Field-level deprecation — annotations in spec

**Rule**: once a version is shipped, it is immutable. Add `/v2/` for
breaking changes.

### 4. Error format

RFC 7807 style:
```json
{
  "type": "/errors/invalid-input",
  "title": "Invalid input",
  "status": 400,
  "code": "FIELD_VALIDATION_FAILED",
  "detail": "email must be a valid RFC 5322 address",
  "errors": [
    { "field": "email", "code": "INVALID_FORMAT" }
  ]
}
```
`code` is stable, machine-readable. `detail` is human.

### 5. Pagination
Cursor-based always. Never offset for user-facing lists.
```
GET /v1/workouts?cursor=<opaque>&limit=20
→ { items: [...], next_cursor: "..." | null }
```

### 6. Idempotency
All POST that create or mutate: `Idempotency-Key` header.
Server stores the key → response mapping for 24h and replays on retry.

### 7. Auth
- OAuth 2.0 + PKCE for user
- Short access (15min) + rotating refresh
- Per-session token
- Scopes documented

## Deliverables

Write `design/api/<resource>.md` with:
- Resource schema
- Endpoints (method + path + request + response + errors)
- Pagination, filtering, sorting rules
- Idempotency story
- Rate limits
- SLO targets

Then generate:
- Server stubs (per backend language)
- Mobile client (per platform: Swift, Kotlin, TS, Dart)

## Delegation

Owned by `backend-engineer` with review from `lead-mobile-engineer`,
`network-engineer`, `security-lead`.
