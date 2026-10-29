---
name: finishing-a-development-branch
description: "Decide what to do with a development branch: merge, abandon, split, or PR. Handles cleanup, squash decisions, and rebase. Adapted from obra/superpowers."
argument-hint: "[branch-name]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit, Bash
---

# Finishing a Development Branch

Every feature branch has a terminal event. Decide it deliberately.

## Decision tree

1. **Does the branch do what it said it would?**
   - Yes → go to 2
   - No → either (a) bring to completion, or (b) split: cherry-pick what's
     done to a new branch, abandon the rest

2. **Is it reviewed + green?**
   - Yes → go to 3
   - No → open PR, request review, iterate per `receiving-code-review`

3. **Squash or merge-commit?**
   - Small feature (< 10 commits): squash to a single commit with clean
     message
   - Large feature with meaningful history: merge commit preserving the
     narrative
   - Follow team convention (documented in CONTRIBUTING.md)

4. **After merge**:
   - Delete the branch (local + remote)
   - Close the story + linked PR
   - Remove feature flag IF the rollout is complete
   - Update sprint doc: move from "in progress" to "done"

## Red flags

- Branch older than 2 weeks without activity — abandon or finish
- PR has > 200 unresolved comments — split the change
- Can't explain the diff in 3 sentences — split the change
- "Will merge after fixing comments" for > 48h — reviewer gave up, redo the
  ask

## Abandoning a branch

- Tag the last useful commit so you don't lose it
  `git tag archive/abandoned-feature-name`
- Push the tag to origin
- Delete the branch
- Write a 2-line note in the story: why abandoned + what was learned

## Delegation

Any engineer. Pair with `requesting-code-review` upstream and
`changelog` / `patch-notes` downstream.
