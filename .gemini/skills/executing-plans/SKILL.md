---
name: executing-plans
description: "Execute a previously-written plan step by step. Verify after each step. Stop and ask on deviation. Integrates with verification-before-completion."
argument-hint: "[path to plan]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit, Bash
---

# Executing Plans

Adapted from [obra/superpowers](https://github.com/obra/superpowers).

## Runtime Loop

For each step in the plan:

1. **State the step** you are about to do.
2. **Do exactly one step**. No drift, no bonus work.
3. **Verify** per the step's verification section (run the test, build,
   lint).
4. **On green**: move to next step.
5. **On red**:
   - Print the failure verbatim.
   - If the failure matches an anticipated risk, consult the mitigation.
   - If not, STOP. Ask the user before diverging from the plan.
6. **On deviation needed** (you learned something that makes the next
   step wrong): STOP. Ask the user. Update the plan, then resume.

## Checkpointing

- After every green step: commit (if the repo cadence is per-green).
- After every 3 steps: mental pulse-check — are we still aligned with the
  goal?

## Hand-off to Subagents

When dispatching a step to a Task subagent (see
`dispatching-parallel-agents`), include:
- The step text verbatim
- The verification
- Explicit scope (which files to touch)
- Explicit out-of-scope (what not to touch)

## Anti-Patterns (reject)

- "While I'm here I also …" — add a line to the plan or a separate issue.
- "Easier to restructure first" — split the restructuring into its own plan.
- Silent fix of an unrelated issue — call it out, don't bundle.

## Delegation

Any engineer. Often paired with `verification-before-completion`.
