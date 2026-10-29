---
name: privacy-manifest
description: "Generate or audit the iOS PrivacyInfo.xcprivacy and the Android Play Data Safety form. Cross-checks against declared SDK list, actual event properties, and in-code uses of required-reason APIs."
argument-hint: "[no arguments]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit, Bash
---

# Privacy Manifest

## iOS — PrivacyInfo.xcprivacy

### Required sections

1. **NSPrivacyTracking** — true/false (honestly, per ATT policy)
2. **NSPrivacyTrackingDomains** — domains you contact that perform tracking
3. **NSPrivacyCollectedDataTypes** — each data type collected:
   - `NSPrivacyCollectedDataType`
   - `NSPrivacyCollectedDataTypeLinkedToUser` (true/false)
   - `NSPrivacyCollectedDataTypeTracking` (true/false)
   - `NSPrivacyCollectedDataTypePurposes` (array of purposes)
4. **NSPrivacyAccessedAPITypes** — required-reason APIs used, with reason codes

### Audit workflow

1. List every SDK in Podfile.lock / SPM. Cross-check each against its own
   PrivacyInfo.
2. Grep the codebase for usages of:
   - `UserDefaults`, `FileManager` write, `stat`/`fstat` → DATA_WRITE reason
   - `systemUptime`, `mach_absolute_time` → TIMESTAMP reason
   - Device model / screen size access → disk-space / screen reasons
3. Compare to declared. Any gap is a rejection risk.

## Android — Play Data Safety

### Required sections in Play Console

- Data collection / sharing per data type
- Encryption in transit (must be Yes for modern apps)
- User can request deletion (must have an endpoint)
- Collection purposes per type (app functionality, analytics, marketing,
  fraud prevention, etc.)

### Audit workflow

1. List every analytics event emitted with a PII-adjacent property.
2. Map event → Play Data Safety category.
3. Confirm "shared with third parties" matches your actual SDK integrations
   (Firebase, Crashlytics, Amplitude, attribution SDKs).

## Output

Write both:
- `ios/PrivacyInfo.xcprivacy` (plist)
- `production/compliance/play-data-safety-<version>.md` (source of truth
  for the Play Console form)

## Cadence

Refresh on:
- Any SDK change
- Any new event emission
- Major release (audit diff vs. last release before submitting)

## Delegation

Owned by `security-lead`. Requires review from `data-lead` (event
accuracy) and `technical-director` (SDK list).
