# settings.local.json — template

Copy to `.agent/settings.local.json` for personal overrides not
committed to git.

```json
{
  "$schema": "https://json.schemastore.org/gemini-code-settings.json",
  "permissions": {
    "defaultMode": "acceptEdits",
    "allow": [
      "Bash(git *)",
      "Bash(npm *)",
      "Bash(npx *)",
      "Bash(bundle exec fastlane *)",
      "Bash(./gradlew *)"
    ],
    "deny": [
      "Bash(rm -rf /*)",
      "Bash(git push --force*)",
      "Bash(git reset --hard*)"
    ]
  }
}
```

## Modes

- `default` — ask on every tool use (safest, noisy)
- `acceptEdits` — Edit/Write auto-accepted; Bash still prompts per
  allow / deny rules
- `bypassPermissions` — no prompts (trust your agent, know your repo)

Pick what matches your tolerance for prompts vs. surprises.
