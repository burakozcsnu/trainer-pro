---
description: Path-scoped rules for config / taxonomy / data JSON / YAML files.
globs: **/*.yaml, **/*.yml, **/*.json, **/config/**, **/data/**
alwaysApply: false
---

# Data / Config File Rules

- Schema documented: either via JSON Schema / OpenAPI spec, or a comment
  block at the head of the file.
- Keys `snake_case`; values use full words not abbreviations.
- Stable keys: once shipped, don't rename a key — deprecate, keep both,
  remove in a later version.
- Enums documented with every allowed value.
- Numeric units stated in the key (`duration_ms`, `distance_m`, not
  `duration`).
- Datetimes ISO 8601 UTC. `created_at`, not `created`.
- No secrets, no API keys, no access tokens — ever.
- Locale-specific data split per locale, not interleaved.
- Event taxonomy (`data/events/*.yaml`): one file per event, schema
  validated in CI.
