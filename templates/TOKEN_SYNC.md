# Design token sync — Phase B

When intake **Sync design tokens** is on — after C2 (or after C if smokes off), before D. Needs **Design tokens GitHub URL**. Do not copy this file into the app.

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
| `metro.config.js` | `tokens:sync` patches `extraThemes: […]` under `withUniwindConfig` (no sidecar JSON) |
| `spacing.css` | Size → `@theme` (+ sm / md / lg+ overrides) |
| `font-families.css` | `--font-family-*` |
| `typography-classes.ts` | Uniwind className strings |
| `typography-primitives.*` / `primitives.css` | Color + size + type primitives |

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
| Typography | All composite styles for sm/md + lg+; keep template aliases if rename would break app code (e.g. `heading-app-section`). |
| Primitives | Emit color **and** size primitives. |
| Skip | Feature-flag collections (Phases, etc.). |

### Coverage gate

Compare source leaves → generated output (or log from the script). Missing schemes, colors, size leaves, or typography = **not done**. Fix `transformAndWrite`; do not hand-edit `generated/*`.

Example Tokens Studio bundle: top-level `files[]` with `collectionName`, `modeName`, `tokens`; aliases like `{neutrals.black-20}` and `{text.text-link-hover}`. Modes such as `Default` / `Rider Tools` are **schemes** (auto light-only); exact `light`/`dark` would be appearance.

## 3 — Run & verify

```bash
bun run tokens:sync
# Include detected scheme slugs as --theme extras when regenerating types:
bunx uniwind generate-artifacts --css ./src/global.css --dts ./src/uniwind-types.d.ts --theme <scheme>…
bun run lint && bun test && bunx tsc --noEmit
```

Fix the script — do not one-off edit `generated/*`. After fonts change: install packages matching exported families; load via `expo-font` ([templates/README.md](./README.md)).

**Gate:** real tokens + coverage + correct appearance/scheme wiring from auto-detect + lint/test/tsc before D. If blocked: keep stubs; document; do not mark B complete.
