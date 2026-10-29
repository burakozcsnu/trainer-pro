# Review Workflow

## Review modes

Set at `production/review-mode.txt`:

- **full** — directors review at each key skill step (learning / teams)
- **lean** — directors only at phase gate transitions (default, recommended)
- **solo** — no director reviews (jams, prototypes)

## Review types

| Review | Owner | When |
|---|---|---|
| Design review | design-director via `/design-review` | per screen / milestone |
| Code review | lead-mobile-engineer + platform specialist via `/code-review` | per PR |
| Architecture review | technical-director via `/architecture-review` | master arch + major ADRs |
| UX review | ux-lead via `/ux-review` | per flow |
| Security review | security-lead via `/security-audit` | features touching auth/money/PII |
| A11y review | accessibility-specialist via `/accessibility-audit` | pre-release + per milestone |
| PRD review | product-manager + product-director via `/review-all-prds` | milestone gates |
| Test evidence review | qa-lead via `/test-evidence-review` | pre-RC |

See `.agent/docs/director-gates.md` for formal gate list.
