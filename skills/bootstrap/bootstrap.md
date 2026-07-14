# Bootstrap workflow

**Intake:** [SKILL.md](SKILL.md) — wait for confirmed name + defaults/custom.  
**Templates:** prefer local clone; else https://github.com/hosam-hubspire/expo-project-bootstrap/tree/main/templates  
**Nav assembly:** [navigation/README.md](https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/templates/navigation/README.md)  
**Installs:** [templates/README.md](https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/templates/README.md)

## Scaffold (Phase A)

1. **Create app** — `bunx create-expo-app@latest <APP_NAME> --template default` (or `CI=true … .` in existing repo). Set `name`/`slug`/`scheme` in `app.json`. No `move_agent_to_root`.
2. **Remove cruft** — demo routes, stock helpers, non-Bun lockfiles, web leftovers (`*.web.*`, `web` script/config, favicon / tutorial-web). Move `app/` → `src/app/` or add `@/` only if missing. Native only. Strip agent-assembly comments from source.
3. **Install** — grouped commands in templates README; skip unchecked groups. Expo: `bunx expo install`. Non-Expo: `bun add …@latest` (except jest — derive from `jest-expo`). Never copy version pins. `bun install --verbose` must exit **0**.
4. **Apply templates** — merge (don’t bulk-copy) `package.json`, `app.json`, `tsconfig.json`, `metro.config.js`, lint/CI, `src/`, `assets/`. `eas.json` only when EAS on. Strip unchecked — [optional/minimal](https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/templates/optional/minimal/README.md).
   - **Tokens off:** stub `generated/` only; no token scripts
   - **Tokens on:** `scripts/sync-design-tokens.mjs` + stub `generated/` + `tokens:sync`; Phase B fills transform
   - **Tabs on:** Expo Router JS `Tabs` + nano icons from `assets/icons/*.svg`
   - **API GraphQL:** GraphQL stack + codegen; Rick and Morty `.env`
   - **API REST:** [optional/rest](https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/templates/optional/rest/README.md); JSONPlaceholder `.env`
   - **API none:** omit GraphQL; skip REST
5. **Navigation / permissions** — start `templates/src/app/`; assemble per [navigation/README.md](https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/templates/navigation/README.md). Permissions → [permissions/README.md](https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/templates/src/utils/permissions/README.md).
6. **Biome** — copy `biome.json`, install `@biomejs/biome@latest`, `bunx biome migrate --write`. Keep names like `SettingsUI.tsx`.
7. **Uniwind** — `src/global.css`; import in root `_layout`; `withUniwindConfig` outermost; `bunx uniwind generate-artifacts --css ./src/global.css --dts ./src/uniwind-types.d.ts`.
8. **Argent** — only when any smoke on: `bunx @swmansion/argent init -y`, then `bun run lint:fix`. Skip when both smokes off. Before C2 CLI: `argent server status` → if tools 401 or link stale, **non-interactive only**: `argent unlink --yes` then `argent link 'argent://<token>@<host>:<port>' --yes` (or `--host`/`--port`/`--token` with `--yes`). Never run bare `argent unlink` / `argent link` without `-y`/`--yes` (interactive prompts hang agents). Then `argent tools` must not 401.
9. **Prebuild** — `bunx expo prebuild` when any smoke on; skip when both off.
10. **Project README** — fill [project-README.md](https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/templates/project-README.md) (Phase A or before D).

### `app.json` merge

Merge under `expo` — do not replace the whole file:

| Key | When | Notes |
|-----|------|-------|
| `name`, `slug`, `scheme` | always | intake |
| `owner` | EAS on | default `hubspire` |
| `plugins` | always | `expo-localization`, nano-icons; + permission plugins when selected |
| `experiments` | always | `typedRoutes`, `reactCompiler` |
| `extra.eas.projectId` | EAS on | from `eas init` / lookup |

Keep `ios` / `android` / icon / splash. **`experiments` and `extra` are siblings.** Drop `web`.

## EAS (Phase A2 — only when Setup EAS on)

1. Set `"owner": "<EXPO_OWNER>"` (default `hubspire`)
2. Merge `templates/eas.json`
3. `bunx expo install expo-dev-client`
4. `bunx eas-cli whoami`; `bunx eas-cli init --non-interactive`

Existing project: skip `--force`; `eas-cli project:info --json` → merge `projectId`. Login fail → ask user to `eas-cli login`.

| Profile | Use |
|---------|-----|
| `development-simulator` | C2 iOS Simulator |
| `development` | Physical device |
| `preview` | Internal QA (Android APK) |
| `production` | Store |

C2 cloud: `bunx eas-cli build -p ios -e development-simulator --non-interactive --wait`. Prefer CLI over Expo MCP `build_run`.

## Verify (Phase C)

```bash
bun run lint && bun test && bunx tsc --noEmit
```

Needs Uniwind types from A step 7.

### Argent smoke (Phase C2)

**Skip when iOS smoke off.** Android alone unsupported — turn iOS on if Android on.

Read `.cursor/rules/argent.md` + `argent-device-interact` first. CLI prep: A step 8.

**iOS — EAS on:** cloud `development-simulator` → `eas build:run` → Metro → tap server → Argent verify.  
**iOS — EAS off:** simulator → `bunx expo run:ios` → Argent verify.

Nav checks: [navigation/README.md C2](https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/templates/navigation/README.md#c2-smoke-expectations).

**Android (when on):** after iOS passes → emulator → `bunx expo run:android` (or EAS `preview`) → same checks.

**Gate:** C2 must pass before B (if sync) or D when smokes on. Both smokes off → skip Argent/C2; after C (+ B if sync), ask about D.

### Design token sync (Phase B)

Only when sync on — [TOKEN_SYNC.md](https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/templates/TOKEN_SYNC.md). After C2 when C2 ran, else after C.

1. Review tokens repo; **auto-detect** appearance vs color schemes ([TOKEN_SYNC.md](https://github.com/hosam-hubspire/expo-project-bootstrap/blob/main/templates/TOKEN_SYNC.md)) — ask only if ambiguous **or** no named Default for light/dark `colorTokens` pin
2. Implement `transformAndWrite` → Uniwind `generated/` (aliases, hex+rgba, stroke/padding/responsive, sm/md/lg+, coverage gate). Pin `APPEARANCE_SCHEME_MAP` in the sync script: named Default → both `default`; else **ask user** which scheme backs light and dark, then pin. Script must not prompt.
3. Wire UI from detection: `colorScheme` when ≥2 schemes; appearance Settings only when `light-and-dark`; light-only → lock / hide dark
4. `bun run tokens:sync` → uniwind artifacts (include `--theme` scheme slugs) → Phase C again
5. Note detection in run report; leave script as re-sync path. Do not require user confirmation of light/dark mapping when a named Default (or exact light/dark modes) makes the pin clear

**Gate:** real generated tokens + coverage checklist + correct appearance/scheme wiring from auto-detect + lint/test/tsc. If blocked, keep stubs; document; do not mark B complete.

**Before D:** filled project README. Commit on `main`; push if repo given. If push fails on `.github/workflows/*` for token scope, push app first then add the workflow via `gh api` (or SSH). Completion summary + Phase R run report in chat — [SKILL.md](SKILL.md).

## Constraints

Latest Expo default · merge templates · replace stock README before D · token generate only when sync on · never hand-edit `generated/*` · C2/B gates per intake · A2 only when EAS on · resolve versions at install · assemble nav from modules · `Screen` + insets · no `@react-navigation/*` app imports · native only · always Phase R in chat (secrets redacted; no report file)
