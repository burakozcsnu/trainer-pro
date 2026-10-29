# Brand Bible — <app name>

**Owner:** @design-director + @content-director
**Last updated:** YYYY-MM-DD

The design system source of truth (visual) + voice guide source of truth
(verbal). Mobile apps that earn their "native" feel follow a bible.

---

## Voice

See `design/voice-guide.md`. Summary here:
- **Principles**: Plain before clever. Warm, not casual. Specific, never vague.
- **Do/Don't examples**: see voice guide.

## Visual identity

### Logo
- Primary (full), monogram (square for app icon), wordmark (flat)
- Clear space, min sizes, color variants (light bg, dark bg, mono)
- Don'ts: stretching, recoloring, drop shadows

### Typography
- Display: _[font family + foundry + license]_
- Body: _[font family]_
- Mono (optional): _[font family]_
- Scale: sizes × weights × line-heights per platform

### Color
- Primary palette: brand-primary, brand-secondary, brand-accent
- Neutral palette: 10-step gray scale
- Semantic: success / warning / error / info (light + dark variants)
- Contrast ratios: every token pair ≥ 4.5:1 normal, ≥ 3:1 large

### Spacing
4pt base unit. Scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64.

### Radius
xs 2 / s 4 / m 8 / l 16 / xl 24 / full 999

### Elevation
0 / 1 / 2 / 3 — each with light + dark shadow specs.

### Iconography
- Grid: 24×24 baseline; 32×32 for tabbar
- Style: outline / solid variants
- iOS: SF Symbols with brand overrides as needed
- Android: Material Symbols + custom set

### Illustration
- Style guide with 5-10 reference pieces
- Export specs: SVG + PNG fallbacks; dark mode pairs

### Motion
- Curves: brand easing for brand moments; platform default elsewhere
- Durations: 150 / 200 / 300 / 500 ms
- Reduce motion: crossfade fallback for every branded transition

## Platform adaptation

See `design-director` agent doc for the iOS vs. Android stance per surface.

## Asset pipeline

- Source files: Figma (components + tokens)
- Token export: `tools-engineer` pipeline → iOS Swift constants +
  Android XML + RN TS + Flutter Dart
- Image export: `design/assets/` with @1x @2x @3x (iOS) and mdpi / hdpi /
  xhdpi / xxhdpi (Android)
