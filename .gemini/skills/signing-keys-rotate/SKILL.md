---
name: signing-keys-rotate
description: "Rotate iOS distribution certificates and Android upload/signing keys without losing production access. Documents the before/after state and the emergency restore path."
argument-hint: "[no arguments]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit, Bash
---

# Signing Keys Rotate

Rotating keys sounds routine; losing one is catastrophic (Android upload
key loss = re-list the app). Treat rotation as a releasable change with
its own review.

## Pre-flight

- [ ] Current state inventoried: cert names, expiry dates, holders, fallback
- [ ] Team members with access listed; remove departed members BEFORE rotating
- [ ] Backup of current key material verified restorable (offline test)
- [ ] Release-manager + devops-lead both aware; window scheduled off
      release day

## iOS — distribution certificate rotation

1. Generate a new cert via `fastlane match nuke_distribution` then
   `fastlane match appstore` (or via Apple Developer portal).
2. CI secrets updated with the new cert ref.
3. Beta-upload with the new cert; confirm TestFlight accepts.
4. Old cert revoked in Apple Developer portal.

## Android — signing key rotation

Two concepts, rotate separately:
- **Upload key** — used to upload to Play. Rotatable via Play Console
  (request key upgrade, old key kept for verification window). Managed by
  Google if you use Play App Signing.
- **App signing key** — final signature users see. Managed by Google if you
  enrolled in Play App Signing; do NOT rotate without escalation.

For upload key:
1. Generate new keystore (`keytool`) and upload to Play Console (key upgrade).
2. Update CI secret with new keystore + alias + password.
3. Next upload uses new key; Play accepts if upgrade-pending.

## Post-rotation

- [ ] Build a release-candidate with the new creds and submit to a beta track
- [ ] Verify it installs over an existing production install (upgrade test)
- [ ] Update `production/credentials-inventory.md` with new expiries
- [ ] Schedule next rotation (annual default)

## Disaster recovery

iOS: if distribution cert is lost, generate a new one; no app-listing impact.
Android: if **signing key** is lost AND Play App Signing NOT used, app must
be re-listed under a new package name. This is why Play App Signing is
non-optional policy.

## Delegation

Owned by `devops-lead` + `security-lead`. `release-manager` coordinates
the window.
