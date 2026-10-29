---
description: Path-scoped rules for networking / sync / offline code.
globs: src/**/network/**, src/**/api/**, src/**/sync/**
alwaysApply: false
---

# Network Code Rules

- Timeouts explicit: 10s connect, 30s total, 3 retries with exponential
  backoff + jitter (cap 60s).
- Idempotency-Key header on every POST that creates or mutates.
- Offline-first for user-generated writes: queue locally, sync on
  reconnect, surface "pending" state in UI.
- Cache aggressively with validation headers. Prefer cached on offline.
- Pagination: cursor-based on both sides.
- Image pipeline: size-to-display (never full-res to thumb); concurrent
  load cap (6 on screen); progressive decode.
- Logged requests include method / status / duration / size / cache-hit /
  retry-count. No PII in logged URLs.
- No raw `URLSession.shared` / `OkHttp()` — wrap in a project client
  with config.
- WebSockets: reconnect backoff, ping/pong, resume token, pause on
  backgrounded app.
- gRPC: keepalive tuned for mobile energy.
