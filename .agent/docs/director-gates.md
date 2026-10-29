# Director Gates

Named checkpoints where a director formally signs off. Gate verdicts
open with `[GATE-ID]: APPROVE | CONCERNS | REJECT` as the first line.

---

## Product Director gates

| Gate ID | Trigger | Scope |
|---|---|---|
| `PD-PILLARS` | Pillars drafted | Are the pillars specific, falsifiable, tension-creating? |
| `PD-CONCEPT` | Concept doc drafted | Pitch + JTBD + differentiator clear? |
| `PD-PRD-ALIGN` | PRD submitted for approval | Serves pillars? Scope honest? |
| `PD-POSITIONING` | Competitive map drafted | Distinct from comparables on meaningful axes? |
| `PD-SCOPE-CUT` | Scope vs. date conflict | Which features survive? |

## Technical Director gates

| Gate ID | Trigger | Scope |
|---|---|---|
| `TD-PLATFORM-CHOICE` | Platform ADR proposed | Native vs. RN vs. Flutter justified? |
| `TD-ARCH-BLUEPRINT` | Master architecture drafted | Modules, state mgmt, DI, nav — all specified? |
| `TD-ADR-APPROVAL` | Individual ADR | Does this decision fit the blueprint? |
| `TD-PERF-BUDGET` | Budgets proposed | Realistic? Measured? |
| `TD-SDK-APPROVAL` | New SDK proposed | License + privacy + size + maintenance pass? |
| `TD-INCIDENT-POSTMORTEM` | Post-incident | Root cause identified? Action items owned? |

## Design Director gates

| Gate ID | Trigger | Scope |
|---|---|---|
| `DD-SYSTEM-LOCK` | Design system v1 | Tokens, components, patterns all covered? |
| `DD-BRAND-AUDIT` | Milestone review | Voice + visual coherent across screens? |
| `DD-SCREEN-APPROVAL` | High-stakes screen | Paywall, onboarding, error states — on-brand? |
| `DD-A11Y-AUDIT` | Pre-release | WCAG AA passes on top-10 flows? |

## Producer gates

| Gate ID | Trigger | Scope |
|---|---|---|
| `P-M0-CONCEPT` | Concept locked | PRD signed by PD? |
| `P-M1-PROTOTYPE` | Prototype | Core loop playable? |
| `P-M2-ALPHA` | Alpha | All pillars visible? Internal test open? |
| `P-M3-BETA` | Beta | Feature complete? External test open? |
| `P-M4-RC` | RC | Crash-free ≥ 99.5%, no P0/P1, assets ready? |
| `P-M5-LAUNCH` | Launch | In production both stores? |
| `P-M6-D30` | 30 days post-launch | Retention + rating on target? |

## Cross-director gates

Some gates require multiple directors — they each post a verdict on
the same PR / doc.

| Gate ID | Directors | Example |
|---|---|---|
| `PRIVACY-SHIP` | TD + PD | Privacy manifest + data safety sign-off |
| `RELEASE-GO` | P + TD + PD | Go / no-go for production submission |
| `BRAND-REPOSITION` | PD + DD + content-director | Significant brand shift |

## Gate verdict format

```
PD-PILLARS: APPROVE

Rationale:
- Pillars 1-4 pass falsifiability test
- Tension between Pillar 2 (simplicity) and Pillar 3 (power features)
  forces hard choices — good
- Pillar 5 ("fast") is too generic. Recommend either sharpening or
  dropping; approved provisionally with a 30-day review

Next: propagate to design-director (DD-SYSTEM-LOCK) and
technical-director (TD-ARCH-BLUEPRINT)
```

Verdicts:
- `APPROVE` — proceed as proposed
- `CONCERNS` — proceed with the listed changes
- `REJECT` — do not proceed; rework
