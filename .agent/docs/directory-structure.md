# Directory Structure

```
<project-root>/
├── GEMINI.md                            # entry point for Gemini CLI
├── README.md
├── UPGRADING.md
├── LICENSE
├── .gitignore
│
├── .agent/
│   ├── settings.json                    # team-wide Gemini CLI config
│   ├── settings.local.json              # personal overrides (gitignored)
│   ├── statusline.sh
│   ├── agents/                          # 51 agent definitions
│   ├── agent-memory/                    # per-agent persistent memory
│   ├── docs/                            # internal docs for Gemini
│   │   ├── agent-roster.md
│   │   ├── agent-coordination-map.md
│   │   ├── technical-preferences.md
│   │   ├── skills-reference.md
│   │   ├── workflow-catalog.yaml
│   │   ├── director-gates.md
│   │   ├── coordination-rules.md
│   │   ├── coding-standards.md
│   │   ├── context-management.md
│   │   ├── quick-start.md
│   │   └── templates/                   # document templates
│   ├── hooks/                           # lifecycle shell scripts
│   ├── rules/                           # path-scoped coding rules
│   └── skills/                          # 109 slash commands
│
├── .github/
│   ├── workflows/                       # CI pipelines
│   ├── ISSUE_TEMPLATE/
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── CODEOWNERS
│
├── design/                              # product specs + designs
│   ├── prd/                             # PRDs per epic
│   ├── ux-spec/                         # screen-level UX specs
│   ├── pillars.md
│   ├── concept.md
│   ├── personas/
│   ├── user-journeys/
│   ├── copy/
│   │   └── strings.yaml                 # translatable strings
│   ├── voice-guide.md
│   └── brand-bible.md
│
├── data/                                # analytics + experimentation
│   ├── events/                          # one YAML per event
│   ├── metrics.md                       # metric glossary
│   ├── funnel.md
│   └── experiments/                     # pre-registered A/B specs
│
├── docs/                                # engineering docs
│   ├── architecture/
│   │   ├── adr-NNN-*.md                 # architecture decision records
│   │   └── tr-registry.yaml             # technical-requirement registry
│   ├── platform-reference/              # authoritative stack docs
│   │   ├── ios/
│   │   ├── android/
│   │   ├── react-native/
│   │   └── flutter/
│   ├── api/                             # API contracts
│   ├── examples/                        # session walk-throughs
│   └── WORKFLOW-GUIDE.md
│
├── production/                          # delivery artifacts
│   ├── sprints/
│   ├── milestones/
│   ├── releases/
│   │   └── vX.Y.Z/
│   ├── risks/
│   ├── crash-triage/
│   ├── a11y/
│   ├── test/
│   │   └── device-matrix.md
│   ├── flags/                           # feature flag specs
│   ├── credentials-inventory.md
│   ├── live-ops-calendar.md
│   └── session-logs/                    # Gemini session transcripts
│
├── prototypes/                          # throwaway prototypes
│
└── src/                                 # product code
    └── GEMINI.md                        # per-stack pointer
```
