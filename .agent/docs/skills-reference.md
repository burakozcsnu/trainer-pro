# Skills Reference

Skills are slash commands. Invoke via `/skill-name [args]`.

## By category

### Onboarding + project setup
- `/start` — first-time guided orientation
- `/setup-platform` — pick + configure the mobile stack
- `/onboard` — bring a new teammate up to speed
- `/adopt` — audit an existing codebase against this template

### Product + planning
- `/brainstorm [hint]` — guided concept exploration
- `/map-systems` — decompose the product into features
- `/create-epics` — epic breakdown
- `/create-stories` — story breakdown
- `/story-readiness` — is this story ready for engineering?
- `/estimate` — story point estimation
- `/sprint-plan` — run sprint planning
- `/sprint-status` — current sprint snapshot
- `/milestone-review` — milestone readiness gate
- `/scope-check` — creep detector
- `/review-all-prds` — cross-PRD audit
- `/retrospective` — sprint retro

### Architecture + decisions
- `/architecture-decision` — write an ADR
- `/architecture-review` — architecture audit
- `/create-architecture` — master architecture blueprint
- `/create-control-manifest` — distilled rules from ADRs
- `/propagate-design-change` — ripple a design change through docs

### Design + UX
- `/design-system` — author or evolve the design system
- `/design-review` — review a design artifact
- `/ux-design` — author UX spec for a screen
- `/ux-review` — UX audit
- `/quick-design` — rough design quickly
- `/frontend-design` — production-grade UI design (Anthropic)
- `/prototype` — build a throwaway prototype

### Code + engineering
- `/code-review` — review a change
- `/dev-story` — implement a ready story
- `/tech-debt` — plan debt repayment
- `/hotfix` — cut and ship a hotfix
- `/day-one-patch` — first-patch-after-launch workflow
- `/systematic-debugging` — root-cause methodology
- `/verification-before-completion` — evidence > vibes
- `/subagent-driven-development` — tiered subagent dispatch
- `/api-design` — typed API contract design

### Testing + QA
- `/qa-plan` — author a QA plan
- `/test-plan` — detailed test plan
- `/test-setup` — scaffold test infra
- `/test-helpers` — shared test utilities
- `/test-driven-development` — TDD loop discipline
- `/ui-screenshot-test` — snapshot test setup
- `/e2e-test` — Maestro / Detox E2E
- `/smoke-check` — pre-release smoke
- `/soak-test` — memory / battery / stability soak
- `/regression-suite` — maintain regression tests
- `/test-evidence-review` — review test artifacts
- `/test-flakiness` — flaky test triage
- `/device-matrix` — define tested devices × OS × locales
- `/accessibility-audit` — WCAG AA + platform a11y

### Mobile-specific
- `/crash-triage` — Crashlytics / Sentry triage
- `/deeplink-audit` — Universal Links / App Links audit
- `/privacy-manifest` — iOS + Play privacy audit
- `/ios-release` — cut + ship iOS release
- `/android-release` — cut + ship Android release
- `/store-submit` — pre-submission checklist
- `/store-listing` — author a store listing
- `/screenshots-generate` — store screenshot pipeline
- `/aso-optimize` — ASO cycle
- `/push-notification-plan` — lifecycle push program
- `/in-app-purchase-plan` — subscription / IAP architecture
- `/ab-test-plan` — pre-register an experiment
- `/feature-flag-plan` — plan a new flag with expiry
- `/retention-funnel` — define and instrument the funnel
- `/ci-mobile-setup` — bootstrap CI pipeline
- `/signing-keys-rotate` — rotate iOS + Android keys safely
- `/perf-profile` — perf investigation
- `/launch-checklist` — pre-launch audit
- `/release-checklist` — per-release checklist
- `/changelog` — update CHANGELOG
- `/patch-notes` — user-facing release notes
- `/release-notes` — store release notes
- `/usability-test-report` — usability study write-up

### Growth + analytics
- `/aso-optimize` — above, duplicated for discoverability
- `/ab-test-plan` — above
- `/retention-funnel` — above
- `/push-notification-plan` — above

### Process + process-engineering
- `/gate-check` — director-gate verification
- `/bug-report` — file a well-formed bug
- `/bug-triage` — triage an inbox
- `/consistency-check` — cross-doc consistency
- `/content-audit` — content sweep
- `/asset-audit` — asset sweep
- `/asset-spec` — author an asset spec
- `/help` — help-at-hand for any skill
- `/project-stage-detect` — what phase are we in?
- `/reverse-document` — derive doc from code
- `/skill-improve` — polish a skill
- `/skill-test` — skill test scaffold
- `/writing-skills` — framework for authoring a skill

### Team skills (multi-agent subteam dispatch)
- `/team-auth` — auth-feature subteam
- `/team-onboarding` — onboarding-feature subteam
- `/team-content` — content-feature subteam
- `/team-platform` — platform-integration subteam
- `/team-ui` — UI design-system team
- `/team-qa` — QA team
- `/team-release` — release team
- `/team-polish` — final-polish team
- `/team-live-ops` — live operations

### Workflow (from superpowers)
- `/writing-plans` — write a plan before implementing
- `/executing-plans` — execute one task at a time
- `/dispatching-parallel-agents` — parallel subagent dispatch
- `/requesting-code-review` — prepare PR for review
- `/receiving-code-review` — respond to review feedback well
- `/using-git-worktrees` — parallel branch work
- `/finishing-a-development-branch` — merge / split / abandon

### Research + builders
- `/deep-research` — multi-step research with citations
- `/artifacts-builder` — React + Tailwind artifact builder

### Optimization
- `/cost-aware-llm-pipeline` — route tasks by cost
- `/context-budget` — audit context bloat
- `/content-hash-cache-pattern` — file-hash caching
- `/security-audit` — security review

## Discovery

Gemini CLI indexes these skills automatically. Type `/` in the
conversation to browse.
