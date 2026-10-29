---
name: device-matrix
description: "Define or refresh the tested device × OS × locale matrix based on current install base. Writes production/test/device-matrix.md."
argument-hint: "[no arguments]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Write, Edit
---

# Device Matrix

## Phase 1 — Install-Base Snapshot

Read `data/reports/install-base-<latest>.csv` (or ask the user to paste):
- Top 10 devices by DAU
- Top 5 OS versions by DAU
- Top 5 locales by DAU

If no install-base data (pre-launch): use platform-wide market share data
for the target market.

## Phase 2 — Matrix Design

Construct:

### iOS
| Device | OS | Rationale |
|---|---|---|
| iPhone 15 Pro | iOS 26 | current flagship |
| iPhone 13 | iOS 18 | baseline (3-year-old) |
| iPhone SE 3 | iOS 18 | small screen |
| iPad Air (5) | iPadOS 18 | tablet sanity (if universal app) |

### Android
| Device | OS | Rationale |
|---|---|---|
| Pixel 8 | Android 15 | current flagship |
| Pixel 6 | Android 14 | baseline |
| Samsung Galaxy A-series (mid) | Android 14 | mid-range install base |
| Small/low-RAM device (< 4GB RAM) | Android 13 | low-end stress |

### Locales
At minimum: en-US + the top 3 by install base. Include 1 RTL if shipped.

## Phase 3 — Budget

- Every P0/P1 story tests on full matrix.
- Release candidate: full matrix.
- Daily smoke: reduced matrix (flagship iOS + flagship Android + 1 locale).
- CI automated: emulator + simulator of baseline devices.

## Phase 4 — Output

Write `production/test/device-matrix.md` with the table and refresh date.
Review quarterly — install base shifts.

## Delegation

Owned by `qa-lead`. Coordinates with `data-lead` for install-base data.
