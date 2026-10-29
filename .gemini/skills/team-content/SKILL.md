---
name: team-content
description: "Mobilize the content-feature subteam — coordinated lineup for any feature built around user-facing content (articles, programs, videos, audio, courses, news)."
argument-hint: "[feature-description]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit, Task
---

# Team Content

Coordinated subteam for content-heavy features: programs, courses, videos,
articles. Many mobile apps are content-first; this skill makes sure the
content pipeline is designed before the code.

## Team composition

- `product-manager` — content model + editorial workflow
- `content-director` — voice guide for the content itself
- `content-strategist` — per-item copy + metadata (title, desc, tags)
- `ux-lead` — list / detail / search / save patterns
- `backend-engineer` — CMS integration, API for content delivery
- `network-engineer` — cache + offline strategy for content
- `ios-specialist` + `android-specialist` — rendering (text, media,
  interaction) per platform
- `localization-lead` — translation pipeline for content
- `analytics-engineer` — content engagement events

## Content model checklist

- Identifier: stable across updates; not the title
- Versioning: content can be edited; clients handle new versions
- Media: image sizes, video format + DRM if needed, audio format + bitrate
- Metadata: title, subtitle, description, tags, category, author, published_at
- Rights: license per item, geo-restrictions if any
- Localization: per-locale content vs. translated shared content

## Delivery principles

- Prefer signed URLs with short TTL for media
- Cache aggressively; invalidate via content version bump
- Offline-capable where it fits user need (courses, programs, saved articles)
- Image pipeline: request size matches render size (never full-res to a thumb)

## Delegation

Invoked by `product-manager` when starting a content-heavy feature.
