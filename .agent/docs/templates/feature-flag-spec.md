# Feature Flag Spec — <flag key>

```yaml
key:        <flag_key>
owner:      @name (role)
purpose:    |
  One paragraph. Why this flag exists. What feature it gates.
type:       boolean | string | int | json
created:    YYYY-MM-DD
expires:    YYYY-MM-DD            # max 60 days from created
flag_kind:  release | experiment | operational | permission

default_values:
  production: false
  staging:    true
  development: true

rollout:
  - YYYY-MM-DD:  5% (internal + QA)
  - YYYY-MM-DD: 25%
  - YYYY-MM-DD: 50%
  - YYYY-MM-DD: 100%

cleanup:
  - YYYY-MM-DD: remove flag code, delete remote-config entry, update docs
  - Verification: grep for "<flag_key>" returns nothing in product code

depends_on: [<other_flag_keys>]   # if this flag gates a feature that
                                   # depends on another flag being on

analytics:
  exposure_event: exposed_<flag_key>
  properties: variant, user_id_hash

```

## Code touch points

- File: `src/feature-flags.ts` — typed enum with new key
- Use sites: `src/features/<name>/…` — behind `isEnabled(<flag_key>)`
- Tests: both branches covered

## Removal checklist

- [ ] Flag at 100% for 2 weeks with no regressions
- [ ] Remove dead branch of code
- [ ] Remove flag enum entry
- [ ] Remove remote-config / LaunchDarkly / Statsig entry
- [ ] Update `production/flags/flag-graveyard.md`
