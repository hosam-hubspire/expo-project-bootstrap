# Design token sync — Phase B

When intake **Sync design tokens** is on — after C2 (or after C if smokes off), before D. Needs **Design tokens GitHub URL**. Do not copy this file into the app.

Icons: export SVGs to `assets/icons/` separately.

## Goal

Rerunnable `bun run tokens:sync` that fetches the intake GitHub tokens repo and writes Uniwind files under `src/theme/tokens/generated/`. Normalize plugin exports inside the script — do not invent an intermediate `raw/` layer.

## Appearance vs color schemes (critical)

These are **different axes**. Do not conflate them.

| Axis | Meaning | Examples | App control |
|------|---------|----------|-------------|
| **Appearance** | Light / dark UI chrome (Uniwind `light` \| `dark` \| `system`) | OS dark mode | `Uniwind.setTheme` / Settings “Appearance” |
| **Color scheme** | Named Figma **variable collection modes** (product / brand themes) | `Default`, `Rider Tools` | In-app scheme toggle (often both schemes are still appearance-*light*) |

**Never auto-map Figma mode names to Uniwind light/dark** (e.g. do **not** assume `Default` → light and `Rider Tools` → dark). Confirm with intake / design. Marta-style SweetTea exports use `Default` and `Rider Tools` as **two light product schemes** the user can switch — not appearance dark mode.

### Intake (when token sync is on)

Confirm before implementing `transformAndWrite`:

| Field | Options / notes |
|-------|-----------------|
| Appearance support | `light-only` · `light-and-dark` |
| Color schemes | List Figma mode names from the export (CSS-safe slugs); mark **default** scheme; multi-scheme toggle on if ≥2 schemes kept |
| Appearance ↔ Figma | Only if a mode truly is dark appearance: explicit mapping. Otherwise schemes stay under appearance light |
| Single scheme | Emit one palette; no scheme Settings UI |
| Light-only | Force `Uniwind.setTheme("light")` (or hide dark/system); emit semantic colors under `@variant light` only (omit dark variant or leave empty stubs unused) |

Wire scheme selection in `preferences-store` (e.g. `colorScheme`) **separately** from `themePreference`. Settings: Appearance panel only when `light-and-dark`; Color scheme panel only when ≥2 schemes.

## 1 — Review tokens repo

Shallow-clone / `gh` the intake URL. Inventory export layout (Tokens Studio, Variables JSON, Style Dictionary, etc.). Note:

- Color **schemes** (collection modes) — names only; do not rename to light/dark unless intake says so
- Size / typography **breakpoint** modes (sm / md / lg+) — unrelated to appearance
- Skip feature-flag collections (e.g. Phases)

## 2 — Implement `scripts/sync-design-tokens.mjs`

| Requirement | Detail |
|-------------|--------|
| Source | Pin intake GitHub URL (constant or `TOKENS_GITHUB_URL`) |
| Fetch | Clone/pull each run (cache under `.tokens-cache/`, gitignored) |
| Output | Overwrite `generated/*` per contract below |
| Headers | `AUTO-GENERATED — do not edit. Run: bun run tokens:sync` |
| Storybook | Update `token-definitions.ts` when present |
| Idempotent | Same inputs → stable outputs |
| Document | Script header: appearance support, scheme slugs, default scheme |

```json
"tokens:sync": "node scripts/sync-design-tokens.mjs"
```

### Uniwind / TS output contract

Match `templates/src/theme/tokens/generated/` **shape intent**; Phase B replaces stubs to match **intake** (stubs may still show `light`/`dark` for the default scaffold’s appearance demo — that is not a Figma mode map).

| File | Role |
|------|------|
| `theme.css` | Semantic `--color-*` under Uniwind **appearance** variants per intake (`@variant light` only when light-only; add `@variant dark` only when appearance includes dark **and** intake maps real dark values) |
| `colors.ts` | Prefer **scheme-keyed** maps (see below); keep `ColorTokenName` as the semantic token key union |
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

/** Active scheme palette helper — UI should not hardcode light/dark for Figma modes. */
export function colorsForScheme(scheme: ColorSchemeName) {
  return colorSchemes[scheme];
}
```

Apply the active scheme by writing CSS variables onto the root (or swapping Uniwind theme tokens) when `colorScheme` changes — **do not** implement scheme switches as `Uniwind.setTheme("dark")` unless intake explicitly says that mode is appearance-dark.

**Single scheme:** one object (or `colorSchemes` with one key); no scheme toggle UI.

Keep `@/theme` import paths. Prefer CSS-safe names. Match stub file names under `generated/`.

### Resolve & emit checklist (do not skip)

| Area | Requirement |
|------|-------------|
| Alias resolution | Resolve before emit. Primitive refs **and** semantic→semantic (include the active scheme’s token tree after primitives). |
| Color values | Accept `#hex` **and** `rgb()` / `rgba()` / `hsl()` / `hsla()`. |
| Color schemes | Emit **every** retained Figma mode under its own slug. No silent drop; no light/dark rename without intake. |
| Appearance | Light-only → light variant only. Light-and-dark → only if dark values exist for that axis (often separate from schemes). |
| Size tokens | `--spacing-*`, `--radius-*`, `--border-width-*` (strokes), padding as spacing keys if needed, `--responsive-*`. |
| Size modes | Mobile-first: **sm** base; **md** `@media (min-width: 768px)`; **lg+** `1024px` (match `global.css` breakpoints). |
| Typography | All composite styles for sm/md + lg+; keep template aliases if rename would break app code (e.g. `heading-app-section`). |
| Primitives | Emit color **and** size primitives. |
| Skip | Feature-flag collections (Phases, etc.). |

### Coverage gate

Compare source leaves → generated output (or log from the script). Missing schemes, colors, size leaves, or typography = **not done**. Fix `transformAndWrite`; do not hand-edit `generated/*`.

Example Tokens Studio bundle: top-level `files[]` with `collectionName`, `modeName`, `tokens`; aliases like `{neutrals.black-20}` and `{text.text-link-hover}`. Modes such as `Default` / `Rider Tools` are **schemes**, not appearance.

## 3 — Run & verify

```bash
bun run tokens:sync
bunx uniwind generate-artifacts --css ./src/global.css --dts ./src/uniwind-types.d.ts
bun run lint && bun test && bunx tsc --noEmit
```

Confirm schemes + appearance with user. Fix the script — do not one-off edit `generated/*`.

After fonts change: install packages matching exported families; load via `expo-font` ([templates/README.md](./README.md)).

**Gate:** real tokens + coverage + correct scheme/appearance wiring + lint/test/tsc before D. If blocked: keep stubs; document; do not mark B complete.
