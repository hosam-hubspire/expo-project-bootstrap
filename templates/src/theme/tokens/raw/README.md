# Raw design-token exports

Used when **Sync design tokens is off** — stub JSON so CI / local theme work before a GitHub sync script exists.

When **sync is on**, tokens come from `bun run tokens:sync` (GitHub plugin exports → Uniwind `src/theme/tokens/generated/`). Do not treat hand-edited `raw/` as the Phase B deliverable — see [`TOKEN_SYNC.md`](../../../../TOKEN_SYNC.md).

Legacy local generator path (optional reference only):

```bash
node scripts/discover-figma-raw.mjs
node scripts/generate-design-tokens.mjs
```
