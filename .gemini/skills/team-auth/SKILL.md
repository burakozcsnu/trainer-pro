---
name: team-auth
description: "Mobilize the auth-feature subteam — a coordinated lineup of specialists that ship or refactor the authentication surface end-to-end: sign-up, sign-in, sign-out, password reset, biometric, SSO."
argument-hint: "[feature-description]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit, Task
---

# Team Auth

A coordinated subteam for authentication work. Auth touches security,
backend, platform, UX, and content — this skill summons the right
specialists and sequences them.

## Team composition

- `product-manager` — PRD, acceptance
- `ux-lead` + `ux-designer` — flow + screens (ui-spec per screen)
- `security-lead` + `security-engineer` — threat model + review
- `backend-engineer` — OAuth / OIDC server flow, token endpoints
- `ios-specialist` + `android-specialist` — native integration
  (biometric, keychain/keystore, ASWebAuthenticationSession, Credential Manager)
- `content-strategist` — microcopy: consent, error, recovery
- `qa-lead` — test plan including adversarial cases

## Standard workflow

1. **PRD** — product-manager drafts, security-lead reviews for data policy.
2. **Threat model** — security-lead runs STRIDE on the feature.
3. **UX spec** — ux-designer drafts, content-strategist adds copy.
4. **API contract** — backend-engineer via `/api-design`.
5. **Parallel platform implementation** — ios + android specialists.
6. **Security review** — security-engineer audits each PR.
7. **QA with adversarial test cases** — qa-lead runs auth-specific plan
   (token leakage, session replay, biometric bypass).

## Mobile auth non-negotiables

- PKCE on the OAuth client
- Tokens in Keychain / Keystore (never UserDefaults / SharedPreferences)
- Refresh token rotation, server-side revocation endpoint
- "Sign out everywhere" works
- Apple Sign In present if any other SSO is offered (App Store rule)
- Biometric is an unlock, not a login (still need server session)

## Delegation

Invoked by `product-manager` or `lead-mobile-engineer` when auth work
starts a sprint.
