# Quick Start

## New project from scratch

1. Clone this template as your project repo
2. `gemini` → run `/start`
3. Pick your path:
   - **No idea yet** → `/brainstorm`
   - **Have a concept** → `/setup-platform`
   - **Have an existing codebase** → `/adopt`
4. Follow the onboarding steps

## Typical first-week workflow

```
/start
  → /brainstorm      (concept)
  → /setup-platform  (pick iOS+Android native / RN+Expo / Flutter)
  → /design-system   (design language)
  → /map-systems     (decompose into features)
  → /create-architecture (tech blueprint + required ADRs)
  → /ux-design       (key screens)
  → /create-epics    (story plan)
  → /sprint-plan     (first sprint)
```

## Daily engineering loop

```
/start (if returning after break)
  → /sprint-status      (what's current)
  → /dev-story STORY-N  (implement the next story)
    ↳ /writing-plans    (before big changes)
    ↳ /test-driven-development (for non-trivial logic)
    ↳ /verification-before-completion (before claiming done)
  → /requesting-code-review
```

## Release day

```
/release-checklist
  → /store-submit <version>
  → /ios-release <version>     (parallel with below)
  → /android-release <version>
  → /patch-notes / /release-notes
  → /live-ops-calendar update
```

## When things break

```
/crash-triage 24h
  → /systematic-debugging
  → /hotfix
  → /incident-response
  → /retrospective
```

## Agents you'll call often

- `product-manager` — writing PRDs, stories, acceptance
- `lead-mobile-engineer` — architecture, reviews
- `ios-specialist` / `android-specialist` — platform questions
- `qa-lead` — test plans, release sign-off
- `release-manager` — shipping

## If stuck

- `/help [skill]` — skill documentation
- `/context-budget` — context feels heavy
- `/project-stage-detect` — unsure what phase you're in
