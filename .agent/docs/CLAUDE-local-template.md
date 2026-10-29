# GEMINI.local.md — template

Copy this content to `GEMINI.local.md` at the project root if you want
per-user behavior overrides that aren't committed to git.

`GEMINI.local.md` is in `.gitignore`.

---

## Personal preferences

- I prefer [Turkish / English / other] responses
- I prefer [concise / detailed] explanations
- I [do / do not] want Gemini to proactively suggest next steps
- I [do / do not] want Gemini to ask me before running any Bash command

## Project context that only I need

- Account ID: _…_
- Dev device: _[iPhone 15 Pro / Pixel 8 / …]_
- Local db: _[path or connection string placeholder]_

## Shortcuts

- When I say "ship it", run `/store-submit` + `/ios-release` +
  `/android-release` without asking
- When I say "fresh start", run `/start` without onboarding questions
