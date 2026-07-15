# Design token sync — Phase B

When intake **Sync design tokens** is on — after A2 (or A when EAS off), before C. Needs **Design tokens GitHub URL**. Do not copy this file into the app.

Icons: export SVGs to `assets/icons/` separately.

## Goal

Rerunnable `bun run tokens:sync` that fetches the intake GitHub tokens repo and writes Uniwind files under `src/theme/tokens/generated/`. Normalize plugin exports inside the script — do not invent an intermediate `raw/` layer.

## Appearance vs color schemes (critical)

These are **different axes**. Do not conflate them.

| Axis | Meaning | Examples | App control |
|------|---------|----------|-------------|
| **Appearance** | Light / dark UI chrome | OS dark mode; Figma modes named exactly `light` / `dark` | `themePreference` + `Uniwind.setTheme("light"|"dark"|"system")` |
| **Color scheme** | Named product / brand themes | `Default`, `Rider Tools` | `colorScheme` + `Uniwind.setTheme(schemeSlug)` (often all appearance-light) |

**Never** treat an arbitrary second mode (e.g. `Rider Tools`) as appearance-dark.

### Auto-detect from the export (no intake questions)

Classify **Color Tokens** (or equivalent) collection modes during Phase B review. **Do not ask** appearance/scheme fields at intake — only the tokens GitHub URL.

| Mode name (case-insensitive) | Treat as |
|------------------------------|----------|
| Exactly `light`, `dark`, or `system` | **Appearance** axis |
| Anything else (`Default`, `Rider Tools`, `Ocean`, …) | **Color scheme** |
| Size/typography modes (`sm`, `md`, `lg+`, `sm/md`, …) | Not color — ignore here |
| Feature flags (Phases, …) | Skip |

Derive wiring:

| Detected | Appearance | Schemes | Settings UI |
|----------|------------|---------|-------------|
| Only `light` + `dark` (no other color modes) | `light-and-dark` | Use appearance axis for CSS; no product scheme toggle | Appearance only |
| ≥1 non-appearance mode, **no** `light`/`dark` modes | `light-only` | All of those modes; default = `Default`/`default` if present, else **agent asks** which scheme backs light (and dark for future) | Scheme toggle if ≥2 |
| Both appearance **and** non-appearance modes | `light-and-dark` + schemes | Non-appearance → schemes; light/dark → appearance | Both panels |
| Single color mode total | `light-only` (unless that mode is literally `dark`) | One scheme; no scheme toggle | Minimal |

**Default scheme / `colorTokens.light`·`dark`:** Pin `APPEARANCE_SCHEME_MAP` in `scripts/sync-design-tokens.mjs` (agent — never interactive in the script).

| Situation | Agent action |
|-----------|----------------|
| Exact Figma `light`/`dark` appearance modes | Use those for `@variant light`/`dark` and `colorTokens`; no ask |
| Named scheme `Default` / `default` | Pin `APPEARANCE_SCHEME_MAP = { light: "default", dark: "default" }` without asking (dark mirrored for future OS dark) |
| Product schemes only, **no** named Default | **Ask the user** which scheme slug maps to light and which to dark, then pin those constants. Dark may equal light until a dark-oriented scheme exists |
| Ambiguous mode names (`Day`/`Night`, …) | Ask only then (existing rule) |

Register product schemes as Uniwind `extraThemes`. Emit `@variant light` / `@variant dark` from the pinned map so dark can be enabled later — still **do not** expose dark in Settings when appearance is light-only.

**Ask only if ambiguous** (e.g. `Day`/`Night`, `Light Mode`/`Dark Mode` — not exact `light`/`dark`) **or** there is no named Default for the light/dark appearance pin. Otherwise proceed and note the detection in the Phase B / run report.

Wire `colorScheme` in `preferences-store` **separately** from `themePreference`. Appearance panel only when `light-and-dark`; color scheme panel only when ≥2 schemes.

## 1 — Review tokens repo

Shallow-clone / `gh` the intake URL. Inventory export layout (Tokens Studio, Variables JSON, Style Dictionary, etc.). Run the auto-detect table above. Note size/typography breakpoint modes (sm / md / lg+) separately. Skip Phases / feature-flag collections.

## 2 — Implement `scripts/sync-design-tokens.mjs`

| Requirement | Detail |
|-------------|--------|
| Source | Pin intake GitHub URL (constant or `TOKENS_GITHUB_URL`) |
| Fetch | Clone/pull each run (cache under `.tokens-cache/`, gitignored) |
| Output | Overwrite `generated/*` per contract below |
| Headers | `AUTO-GENERATED — do not edit. Run: bun run tokens:sync` |
| Storybook | Update `token-definitions.ts` when present |
| Idempotent | Same inputs → stable outputs |
| Document | Script header: detected appearance, scheme slugs, default scheme |

```json
"tokens:sync": "node scripts/sync-design-tokens.mjs"
```

### Uniwind / TS output contract

Match `templates/src/theme/tokens/generated/` **shape intent**; Phase B replaces stubs to match **detection** (stubs may still show `light`/`dark` for the default scaffold’s appearance demo — that is not a Figma mode map).

| File | Role |
|------|------|
| `theme.css` | Semantic `--color-*` under Uniwind variants: appearance `light`/`dark` from exact modes **or** from agent-pinned `APPEARANCE_SCHEME_MAP`; product schemes as `@variant <slug>` |
| `colors.ts` | `colorSchemes` (scheme-keyed) + first-class `colorTokens.light`/`dark` (pinned scheme sources); keep `ColorTokenName` as the semantic token key union |
| `metro.config.js` | `tokens:sync` patches `extraThemes: […]` under `withUniwindConfig` (no sidecar JSON). **Idempotent:** if the array already matches the detected scheme slugs, leave the file untouched (do not throw). Only throw when `extraThemes` is missing from the config. |
| `spacing.css` | Size → `@theme` (+ sm / md / lg+ overrides) |
| `typography-primitives.css` | **`@theme`** typography primitives: `--text-size-*` → `text-size-*`; `--leading-*` → `leading-*` (unitless); `--font-Regular\|Medium\|Bold` → weight faces (see Typography below) |
| `typography-primitives.ts` | TS mirrors of size / leading / font-face maps for Storybook + `tailwind-merge` |
| `typography-classes.ts` | Composite class strings: `text-size-*` + `leading-*` + `font-Regular\|Medium\|Bold` (**not** hardcoded `text-[Npx]` / `leading-[Npx]` / `font-normal`) |
| `primitives.css` | Color + size primitive CSS vars (inventory; semantic UI uses scheme colors + spacing `@theme`) |

**Preferred `colors.ts` shape (multi-scheme):**

```ts
export const colorSchemes = {
  default: { /* semantic token → CSS color */ },
  "rider-tools": { /* … */ },
} as const;

export type ColorSchemeName = keyof typeof colorSchemes;
export const defaultColorScheme = "default" satisfies ColorSchemeName;

export type ColorTokenName = keyof (typeof colorSchemes)[typeof defaultColorScheme];

export function colorsForScheme(scheme: ColorSchemeName) {
  return colorSchemes[scheme];
}

export const colorTokens = {
  light: colorSchemes.default,
  dark: colorSchemes.default,
} as const;

export const appearanceSchemeMap = { light: "default", dark: "default", source: "named-default" } as const;

export type TokenAppearanceKind = "light-only" | "light-and-dark" | "dark-only";

export const tokenAppearance: {
  kind: TokenAppearanceKind;
  schemes: readonly ColorSchemeName[];
} = {
  kind: "light-only",
  schemes: ["default", "rider-tools"],
};
```

Switch schemes with `Uniwind.setTheme(schemeSlug)` — **not** `setTheme("dark")` unless detection classified that mode as appearance-dark.

**Single scheme:** one object (or `colorSchemes` with one key); no scheme toggle UI.

Keep `@/theme` import paths. Prefer CSS-safe names. Match stub file names under `generated/`.

### Resolve & emit checklist (do not skip)

| Area | Requirement |
|------|-------------|
| Alias resolution | Resolve before emit. Primitive refs **and** semantic→semantic (include the active scheme’s token tree after primitives). |
| Color values | Accept `#hex` **and** `rgb()` / `rgba()` / `hsl()` / `hsla()`. |
| Color schemes | Emit **every** retained non-appearance color mode under its own slug. No silent drop; no light/dark rename of product schemes. |
| Appearance | From exact `light`/`dark` modes only; else light-only. |
| Size tokens | `--spacing-*`, `--radius-*`, `--border-width-*` (strokes), padding as spacing keys if needed, `--responsive-*`. |
| Size modes | Mobile-first: **sm** base; **md** `@media (min-width: 768px)`; **lg+** `1024px` (match `global.css` breakpoints). |
| Typography | All composite styles for sm/md + lg+. Emit **tokenized** classes only — see **Typography (Uniwind)** below. **Do not** emit scaffold aliases (e.g. `heading-app-section`). Rename app / Storybook `variant` strings to the generated Figma token names (e.g. `heading-rider-tools-section`). |
| Primitives | Emit color **and** size primitives. Register typography size / leading / weight faces in `@theme`. |
| Skip | Feature-flag collections (Phases, etc.). |

### Typography (Uniwind) — required shape

Compose from declared primitives (same idea as a Tailwind `theme.extend` + `getTextVariantTailwindClassName` map). **Do not** bake pixel sizes or line-heights into class strings.

```ts
// typography-classes.ts — good
"global-body-base": "text-size-400 leading-md font-Regular lg:text-size-450",
"global-body-small-bold": "text-size-350 leading-md font-Medium lg:text-size-400",

// bad — hardcodes px / CSS font-weight (broken for custom fonts on RN)
"global-body-base": "text-[16px] leading-[19px] font-normal font-sans",
```

| Piece | `@theme` token | Utility | Source |
|-------|----------------|---------|--------|
| Font size | `--text-size-400: 16px` | `text-size-400` | Typography size primitives (`size.size-400`) |
| Line height | `--leading-md: 1.2` | `leading-md` | Leading primitives (unitless). Default `md` when composites omit line-height — do not invent per-style leading maps unless Figma exports them |
| Weight face | `--font-Regular: "Regular"` | `font-Regular` | **RN weight faces** — see below |

**RN weight faces (critical):** React Native ignores CSS `font-weight` on custom fonts. Map Figma weights to separate loaded families:

| Figma weight | Uniwind class | App load + CSS |
|--------------|---------------|----------------|
| Regular (and thin/light fallbacks) | `font-Regular` | `expoFontSourceMap.Regular` + `--font-Regular` in `typography-primitives.css` |
| Medium | `font-Medium` | `…Medium` |
| Bold | `font-Bold` | `…Bold` |

- Emit **one** face class per style (`font-Bold`), never `font-bold` + `font-sans`.
- `IconFontLoader` / root loader: `useFonts({ ...expoFontSourceMap })`.
- `--font-*` values must equal the **native names** expo-font registers (usually the map keys when custom files are loaded).
- Phase B: install/load the brand `.ttf`s (or Google font packages) and keep keys `Regular` / `Medium` / `Bold` stable when swapping files.
- **Mono / second family:** only add extra faces (e.g. `MonoRegular`) when the design system needs a separate loaded mono stack. Do not invent mono faces by default — map monospaced composites to the same Regular/Medium/Bold faces unless intake fonts include a dedicated mono.

Keep `expoFontSourceMap` in `src/theme/typography.ts` as the hand-maintained **load map**. Sync emits `--font-*` / `typographyFontFaces` in `typography-primitives.*` — do not maintain a separate `fonts.ts` or empty `font-families.css` import.

**Class overrides:** `ThemedText` (and any variant + `className` composition) must use `tailwind-merge` via `mergeTypographyClassName` / `typographyTwMerge` in `src/theme/typography.ts`, with `extendTailwindMerge` class groups for custom `text-size-*`, `leading-*`, and `font-Regular|Medium|Bold` (keys from generated `typography-primitives`). Do not string-join conflicting utilities — later overrides would not win reliably.

**Line height gate:** Generated recipes include `leading-*`, but applying leading is optional per instance. `ThemedText` exposes `withLineHeight` (default `true`). Pass `withLineHeight={false}` (or `typographyClassName(variant, { withLineHeight: false })`) to omit leading utilities — do not fork variants just to drop line height.

### Coverage gate

Compare source leaves → generated output (or log from the script). Missing schemes, colors, size leaves, or typography = **not done**. Fix `transformAndWrite`; do not hand-edit `generated/*`.

Carry the same inventory into the Phase R run report **Design token import gaps** section (when sync on): schemes, semantic colors, primitives, size/typography (incl. sm/md/lg+), unresolved aliases, intentionally skipped collections (e.g. Phases), font packages / `expo-font` load gaps, and Settings / `extraThemes` wiring. See skills/bootstrap/SKILL.md run report template.

Example Tokens Studio bundle: top-level `files[]` with `collectionName`, `modeName`, `tokens`; aliases like `{neutrals.black-20}` and `{text.text-link-hover}`. Modes such as `Default` / `Rider Tools` are **schemes** (auto light-only); exact `light`/`dark` would be appearance.

## 3 — Run & hand off to Phase C

```bash
bun run tokens:sync
# Include detected scheme slugs as --theme extras when regenerating types:
bunx uniwind generate-artifacts --css ./src/global.css --dts ./src/uniwind-types.d.ts --theme <scheme>…
```

Then Phase C (`lint` / `test` / `tsc`) once — do not re-verify inside B. Fix the script — do not one-off edit `generated/*`. After fonts change: install packages matching exported families; load via `expo-font` ([templates/README.md](./README.md)).

**Gate:** real tokens + coverage + correct appearance/scheme wiring from auto-detect before C. If blocked: keep stubs; document; do not mark B complete.
