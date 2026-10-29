# Coordination Rules

How agents work with each other and with the user.

## User-in-the-loop

Every agent follows: **Question → Options → Decision → Draft → Approval**.

- Ask before making a significant decision (not about obvious trivia).
- Present 2-3 options with trade-offs when the decision has trade-offs.
- Draft changes before applying.
- Get explicit approval for multi-file changes.
- Never commit without user instruction.

## Agent hand-offs

- **Escalation**: a specialist raises a question to its lead, a lead to
  its director, a director to the user.
- **Delegation**: a director routes to a lead, a lead to a specialist.
  The delegated agent must produce a result, not silently fail.
- Every hand-off is explicit — the calling agent names the target
  ("I'll delegate to `ui-engineer` for the component implementation").

## Director gates

Gates are named checkpoints where a director must approve. Examples:

- `PD-PILLARS` — product-director signs off on pillars
- `TD-ARCH-BLUEPRINT` — technical-director on master architecture
- `DD-SYSTEM-LOCK` — design-director on design-system v1

Gate verdicts: `APPROVE` | `CONCERNS` | `REJECT` — on its own line as
the first line of the director's response.

Full gate catalog: `.agent/docs/director-gates.md`.

## Definition of done

A story is DONE when:

- [ ] Acceptance criteria pass on device
- [ ] Tests green (unit + snapshot + UI as applicable)
- [ ] Lint clean
- [ ] Analytics events verified in debug view
- [ ] Accessibility labels + focus order checked
- [ ] Empty / error / offline states behave
- [ ] PR linked to story with screenshots

## Review cadence

- Per-story: lead-mobile-engineer + relevant platform specialist
- Per-feature: ux-lead + product-manager alignment review
- Per-sprint: producer runs retrospective
- Per-release: qa-lead signs off; release-manager submits
- Per-milestone: all directors gate-check

## Conflict resolution

When two specialists disagree:
1. They attempt to resolve directly
2. If not resolved in 24h, escalate to their lead
3. If cross-lead, escalate to the relevant director
4. Ultimate tie-break: product-director
