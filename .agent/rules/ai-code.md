---
description: Path-scoped rules for on-device ML / AI integration code.
globs: src/**/ml/**, src/**/ai/**, src/**/inference/**
alwaysApply: false
---

# AI / ML Code Rules

- Inference on background queue. Never on main thread.
- Model files versioned with a hash in filename; load-time verification
  of hash.
- Quantization (int8/int4) accuracy delta measured and documented before
  shipping.
- On-device vs. cloud decision documented per feature (latency, privacy,
  size, offline).
- Warm-up on app start if first-use must be fast.
- Fallback path: cloud model when on-device fails to load; graceful
  degradation UX when neither is available.
- Prompts (for LLMs) are reviewed code; system prompts live in source,
  not remote config.
- Prompt-injection defense at the input boundary (strip / sandbox user
  text before system-prompt concat).
- No training on user data without explicit consent + privacy manifest
  entry.
- Inference events emit latency, model version, cached-vs-fresh, and
  outcome (success / fallback / error).
- On-device models declared in privacy manifest; cloud inference
  declared in data-safety form.
