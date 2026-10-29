---
name: receiving-code-review
description: "Respond to code review feedback well: read all comments first, group them, respond to each, and merge with intent. Adapted from obra/superpowers."
argument-hint: "[pr-url or no args]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit, Bash
---

# Receiving Code Review

Review is a conversation. Read, think, respond — don't auto-apply.

## Workflow

1. **Read every comment before replying to any.** Patterns emerge when
   you see them together.
2. **Group** comments into:
   - BLOCKERS (correctness, security, design conflict)
   - MUSTS (standards, idiom, missing test)
   - NITS (style, naming)
   - DISCUSSIONS (approach disagreement)
3. **For blockers + musts**: fix in the PR or open a follow-up with a
   commitment date.
4. **For nits**: apply if agreed, decline politely if not (with reason).
5. **For discussions**: have the conversation async in comments, pull to
   voice if thread > 5 round trips.
6. **Reply to every thread.** "Fixed in <commit sha>" or "Will do in
   follow-up <ticket>" or "Keeping as-is because …".
7. **Resolve threads you've addressed.** Leave unresolved what's pending.
8. **Request re-review** only after all blockers closed.

## Response tone

- Assume good intent — the reviewer is trying to help
- When disagreeing: "I see it differently because …" not "you're wrong"
- When agreeing: thank them + fix, don't over-explain
- Defer expertise where appropriate (ios-specialist on iOS idiom;
  security-lead on crypto)

## Red flags in your own responses

- "Will fix later" without a ticket — loses context
- Passive aggression — CI friction + slower merges
- Reopening a closed thread without new information

## Delegation

Any engineer whose PR is under review.
