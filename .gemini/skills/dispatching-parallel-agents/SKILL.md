---
name: dispatching-parallel-agents
description: "Dispatch multiple Task subagents in parallel for independent work streams: platform parity (iOS + Android), doc + code, or research + implementation. Prevents sequential-when-parallel-is-possible bloat."
argument-hint: "[description of independent streams]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit, Bash, Task
---

# Dispatching Parallel Agents

Adapted from [obra/superpowers](https://github.com/obra/superpowers).

## When to dispatch in parallel

- **Platform parity**: same feature on iOS + Android — dispatch
  `ios-specialist` and `android-specialist` in parallel.
- **Split independent files**: one agent edits A, another edits B, with
  no shared state.
- **Research + implementation**: one agent researches an SDK while another
  prepares the test harness.

## When NOT to dispatch in parallel

- Work is sequentially dependent — agent B needs agent A's output.
- Shared-file edits — merge conflicts will waste more time than serial.
- High ambiguity — you'd re-explain the same context N times.

## Calling Pattern

In a single assistant response, open N tool calls to the `Task` tool:

```
Task(subagent_type="ios-specialist", prompt="<full context + scope>")
Task(subagent_type="android-specialist", prompt="<full context + scope>")
```

Each prompt must be self-contained. The subagent does not see your
conversation.

## Prompt Template for a Subagent

```
Goal: [one sentence]

Context:
- [what the product is]
- [what this feature needs to do]
- [relevant file paths]

Scope:
- Do: [exact deliverable]
- Don't: [out-of-scope]

Verification:
- [how you'll know it's right]

Report format:
- [how you want the result back — patch, summary, doc]
```

## After the subagents return

Reconcile outputs. If two agents converged on incompatible approaches,
you decide — do not let the subagents negotiate through you.

## Delegation

Any agent that can invoke Task.
