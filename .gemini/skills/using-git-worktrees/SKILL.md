---
name: using-git-worktrees
description: "Use git worktrees to work on multiple branches in parallel without stashing. Adapted from obra/superpowers. Use when you need to context-switch between a feature branch, hotfix, and main review."
argument-hint: "[branch-name]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit, Bash
---

# Using Git Worktrees

Git worktrees let you have multiple branches checked out at once —
different directories, same repo, one `.git` dir.

## When they help

- Hotfix while deep in a feature: don't lose uncommitted state.
- Reviewing a PR locally without disturbing your working branch.
- Running a long test suite on main while building a feature.

## Commands

```bash
# Create a worktree for a hotfix off origin/main
git worktree add ../workout-app-hotfix-1.2.4 -b hotfix/1.2.4 origin/main

# List worktrees
git worktree list

# Switch to it
cd ../workout-app-hotfix-1.2.4

# Remove when done (keep branch if you want)
git worktree remove ../workout-app-hotfix-1.2.4
```

## Mobile-specific gotchas

- **Build caches are per-directory** — Gradle/Xcode/DerivedData won't
  share. First build in a fresh worktree is slow.
- **CocoaPods / SPM resolved**: usually fine, but run `pod install`
  after switching if Podfile differs.
- **node_modules** (RN/Flutter): run install in the new worktree.
- **Symlinking to save disk**: possible for node_modules and caches via
  settings.json `worktree.symlinkDirectories`, but test first.

## Safety

- Don't run the same emulator/simulator from two worktrees simultaneously.
- Double-check which worktree your build artifacts came from before
  submitting.

## Delegation

Any engineer handling parallel work.
