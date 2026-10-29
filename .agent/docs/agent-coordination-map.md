# Agent Coordination Map

Who reports to whom, who delegates to whom. Compact reference.

## Tier hierarchy

```
                          ┌────── product-director ──────┐
                          │         (Opus)               │
                          │                              │
        ┌──── technical-director ────────┐               │
        │         (Opus)                 │               │
        │                                │               │
┌───────┴───────┐  ┌────────────┐  ┌────┴──────┐  ┌────┴─────────┐
│  producer     │  │design-dir  │  │product-   │  │content-      │
│  (Sonnet)     │  │(Opus)      │  │manager    │  │director      │
│  schedule     │  │design sys  │  │(Sonnet)   │  │(Sonnet)      │
└───────────────┘  └─────┬──────┘  │PRDs       │  │voice/copy    │
                         │         └────┬──────┘  └───────┬──────┘
                         │              │                 │
             ┌───────────┴─────┐        │                 │
             │                 │        │                 │
        ┌────┴─────┐    ┌─────┴────┐    │           ┌────┴─────────┐
        │ ux-lead  │    │audio-dir │    │           │content-      │
        │(Sonnet)  │    │(Sonnet)  │    │           │strategist    │
        └────┬─────┘    └────┬─────┘    │           │(Sonnet)      │
             │               │          │           └──────────────┘
        ┌────┴─────┐   ┌────┴──────┐    │
        │ux-       │   │sound-     │    │
        │designer  │   │designer   │    │
        │motion-   │   │(Sonnet)   │    │
        │designer  │   └───────────┘    │
        └──────────┘                    │
                                        │
                      ┌─────────────────┴─────────────────┐
                      │                                   │
            ┌─────────┴─────────────┐   ┌─────────────────┴─────┐
            │  lead-mobile-engineer │   │    qa-lead            │
            │      (Sonnet)         │   │    (Sonnet)           │
            └─────────┬─────────────┘   └───────────┬───────────┘
                      │                             │
          ┌───────────┼──────────────┐       ┌──────┼──────────┐
          │           │              │       │      │          │
   ┌──────┴─────┐ ┌───┴──────┐ ┌─────┴───┐   │  ┌──┴───┐  ┌───┴──────────┐
   │ios-        │ │android-  │ │rn-spec  │   │  │qa-   │  │accessibility-│
   │specialist  │ │specialist│ │flutter- │   │  │tester│  │specialist    │
   │+ 3 sub     │ │+ 3 sub   │ │specialist│  │  └──────┘  └──────────────┘
   └────────────┘ └──────────┘ │+ 3 sub  │   │
                               └─────────┘   │
                                      ┌──────┴──────┐
                                      │performance- │
                                      │analyst      │
                                      └─────────────┘
                                      (also reports to
                                      technical-director)
```

## Other reporting lines

- `release-manager` → producer (schedule) + technical-director (impact)
- `devops-lead` → technical-director; delegates to `devops-engineer` +
  `tools-engineer`
- `data-lead` → product-director (metric strategy); delegates to
  `analytics-engineer`
- `growth-lead` → product-director; delegates to `aso-specialist` +
  `growth-engineer` + coordinates `community-manager`
- `security-lead` → technical-director; delegates to `security-engineer`
- `localization-lead` → product-director
- `live-ops-manager` → growth-lead; coordinates with product-manager +
  data-lead
- `monetization-analyst` → growth-lead; coordinates with backend-engineer

## Escalation shortlist

| Question type | Escalate to |
|---|---|
| "What is this app at its core?" | product-director |
| "Should we support iOS only?" | technical-director |
| "Is this screen on-brand?" | design-director |
| "Can we ship Friday?" | producer |
| "Is this release safe?" | qa-lead → technical-director |
| "Can we add this SDK?" | technical-director + security-lead |
| "Why is retention down?" | data-lead + product-director |
| "Did the paywall A/B win?" | monetization-analyst → data-lead |
