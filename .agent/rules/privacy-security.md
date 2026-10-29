---
description: Path-scoped rules for privacy / security / compliance-sensitive code.
globs: src/**/auth/**, src/**/payment/**, src/**/identity/**, src/**/privacy/**, **/PrivacyInfo.xcprivacy
alwaysApply: false
---

# Privacy & Security Rules

- Tokens in Keychain (iOS) / EncryptedSharedPreferences or Keystore
  (Android) / secure storage (RN `react-native-keychain`, Flutter
  `flutter_secure_storage`). Never `UserDefaults` / `SharedPreferences`
  for secrets.
- TLS only. No cleartext HTTP in `AndroidManifest.xml`
  (`android:usesCleartextTraffic="false"`). ATS strict on iOS; no
  `NSAllowsArbitraryLoads`.
- Certificate pinning for high-value endpoints. Primary + backup cert
  so rotation doesn't brick.
- OAuth with PKCE on mobile clients. No plain client secrets shipped.
- Biometric unlock is an unlock, not a login — still need a server
  session.
- App Privacy Manifest (iOS `PrivacyInfo.xcprivacy`) covers every required-
  reason API + SDK. Play Data Safety mirrors collection + sharing reality.
- No PII in analytics events or logs (raw email, phone, full name, birth
  date, precise location over 3 decimals). Hash or bucket.
- No debug logging of tokens, passwords, session ids.
- Background screen hardening on sensitive screens (blur / gray in
  app-switcher snapshot).
- Jailbreak / root detection: inform the user, don't block by default.
  Document the policy.
- Crypto: AEAD (AES-GCM or ChaCha20-Poly1305). No ECB mode. No
  hand-rolled crypto.
- Secrets never in repo or committed build files. Env-injected at build.
