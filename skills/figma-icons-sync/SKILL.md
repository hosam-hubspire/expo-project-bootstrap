---
name: figma-icons-sync
description: >-
  Sync icon SVGs from a Figma frame into an Expo project using batched use_figma
  exports, raw JSON in /tmp, and persist-figma-export.mjs. Use for expo-project-bootstrap
  Phase C when a Figma icons URL is provided, for icons-only bootstrap, or when
  re-syncing icons from Figma.
disable-model-invocation: true
---

# Figma Icons Sync

Export logical icons from a Figma frame to `assets/icons/*.svg`, then regenerate the nano-icons font.

**Invoked by:** `expo-project-bootstrap` Phase C when a **Figma icons section URL** is provided. Also use standalone after scaffold when only icons are in scope.

## Inputs

| Input | Required | Notes |
|-------|----------|-------|
| **Project root** | Yes | Absolute path; must contain `scripts/persist-figma-export.mjs` and `assets/icons/` |
| **Figma icons URL** | Yes | Frame/page/section containing `COMPONENT` children |
| **Prerequisite** | Yes | Phase A scaffold done; `react-native-nano-icons` installed; `bun install` exit 0 |

Parse URL:

- `figma.com/design/:fileKey/...?node-id=20-1220` → `nodeId = "20:1220"` (replace `-` with `:` in node-id)
- Icons-only bootstrap may run after Phase A without Phase B

## Critical rules

1. **MCP ≠ export** — a `use_figma` response in chat is not done until `persist-figma-export.mjs` runs and SVG count is verified on disk.
2. **Raw JSON only** — write `[{ name, svg }, ...]` to `/tmp`. **Never** base64-encode SVG payloads.
3. **No repo bridge scripts** — do not add `save-figma-*.mjs`, manifests, or batch importers under `scripts/`.
4. **Non-overlapping slices** — parallel workers must use disjoint `[START, END)` ranges and unique `/tmp/icons-sN.json` files.
5. **Small batches** — default **10** icons per `use_figma` call; drop to **5** if the MCP response truncates (~20KB).

Allowed loop (per slice):

```
use_figma(slice) → write /tmp/icons-sN.json → persist → verify count
```

```bash
cd "<PROJECT_ROOT>"
node scripts/persist-figma-export.mjs icons /tmp/icons-sN.json
ls -1 assets/icons/*.svg | wc -l
```

---

## Step 1 — Inventory

Call **`get_metadata`** on the icons frame URL. List `COMPONENT` children in document order.

Record:

- **N** — total logical icons after dedup
- **NODE_ID** — e.g. `20:1220`
- Ordered component names (for slice planning)

**Deduplication** (one SVG per logical icon):

| Rule | Action |
|------|--------|
| Size variants (16, 20, 24…) | Same icon — size is an `Icon` prop |
| Light/dark or fill variants | Same icon — `color` / `colorToken` props |
| Different shapes (outline vs solid, chevron-left vs right) | Separate icons |
| Filenames | kebab-case; no size/theme in name (`home.svg`, not `home-24-dark.svg`) |

Remove template placeholder SVGs in `assets/icons/` that are not in the Figma inventory before counting the gate.

---

## Step 2 — Plan slices

Compute batches of size **B** (start with **10**):

```
sliceCount = ceil(N / B)
slice i: START = i * B, END = min((i + 1) * B, N)
temp file: /tmp/icons-s{i}.json
```

Track progress:

```
Icon sync progress (N=<N>, B=<B>):
- [ ] s0  START–END  /tmp/icons-s0.json
- [ ] s1  ...
```

If any slice response truncates, halve **B** for remaining slices only and re-export failed ranges.

---

## Step 3 — Export (parallel when N > 20)

### Coordinator (parent agent)

1. Complete Step 1–2.
2. Choose parallelism **P** = min(4, sliceCount) when **N > 20**; otherwise export sequentially in one agent.
3. Assign disjoint slice ranges to workers (see assignment table below).
4. After all slices finish, run Step 4 gate once.

### Worker (same agent or Task subagent)

For each assigned slice:

1. **`use_figma`** with the export snippet (Step 5) — set `NODE_ID`, `START`, `END`.
2. **Write** the returned JSON array to the assigned `/tmp/icons-sN.json` (Write tool preferred; no base64).
3. **Persist immediately:**
   ```bash
   node scripts/persist-figma-export.mjs icons /tmp/icons-sN.json
   ```
4. Report: slice id, icons written, current `ls assets/icons/*.svg | wc -l`.

**Parallel launch:** send one message with multiple Task tool calls — one worker per slice group, non-overlapping ranges only.

Example assignment (**N=107**, **B=10**, **P=4**):

| Worker | Slices | Ranges (START–END) |
|--------|--------|---------------------|
| W1 | s0–s2 | 0–10, 10–20, 20–30 |
| W2 | s3–s5 | 30–40, 40–50, 50–60 |
| W3 | s6–s8 | 60–70, 70–80, 80–90 |
| W4 | s9–s10 | 90–100, 100–107 |

If Figma plugin calls serialize and parallel gains are minimal, fall back to sequential slices in one agent — correctness beats speed.

---

## Step 4 — Icon gate

All must pass before bootstrap Phase D or commit:

```bash
cd "<PROJECT_ROOT>"
ls -1 assets/icons/*.svg | wc -l    # must equal N
cp assets/icons/.nanoicons.json.example assets/icons/.nanoicons.json
bun run icons:generate
```

Confirm `.ttf` and `.glyphmap.json` under `assets/icons/` were regenerated. **Never** run nano-icons CLI without `--path ./assets/icons` (template script already sets this).

Document in the bootstrap summary: **N**, dedup notes, batch size used, parallel vs sequential, any ambiguous variants.

---

## Step 5 — use_figma export snippet

One call per slice. Only change `NODE_ID`, `START`, `END`:

```javascript
const NODE_ID = "20:1220"; // from URL node-id
const START = 0;           // inclusive
const END = 10;            // exclusive

function normalizeSvg(svg) {
  return svg
    .replace(/ fill="(?!none|currentColor)[^"]+"/g, ' fill="currentColor"')
    .replace(/ stroke="(?!none|currentColor)[^"]+"/g, ' stroke="currentColor"');
}

function toKebab(name) {
  return name
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

const frame = await figma.getNodeByIdAsync(NODE_ID);
if (!frame) return { error: `Node not found: ${NODE_ID}` };

const components = frame.children.filter((c) => c.type === "COMPONENT");
const slice = components.slice(START, END);

const icons = [];
for (const child of slice) {
  const bytes = await child.exportAsync({ format: "SVG" });
  let svg = "";
  for (let i = 0; i < bytes.length; i++) svg += String.fromCharCode(bytes[i]);
  icons.push({ name: toKebab(child.name), svg: normalizeSvg(svg) });
}

return icons;
```

Expected persist shape:

```json
[{ "name": "check", "svg": "<svg>...</svg>" }]
```

---

## Truncation recovery

1. Response cut off or JSON invalid → reduce batch size (10 → 5 → 3).
2. Re-run **only** the failed `[START, END)` range.
3. Persist to a new `/tmp` file; do not skip verify step.

---

## Forbidden

- Base64-encoding icon payloads to work around MCP size limits
- One `use_figma` call for the entire library when N > ~10
- Marking Phase C complete without disk count === N
- Adding project scripts to bridge MCP → disk
- `download_assets` per icon (107 calls) unless exporting a single asset

---

## Reference

Persist script usage: `templates/FIGMA_EXPORT.md` Phase C in the expo-project-bootstrap repo.
