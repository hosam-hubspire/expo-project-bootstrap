# Raw Figma exports

Place Figma variable and text-style JSON here — **any file or folder layout**.

The generator discovers exports by JSON shape and hints (`collection` name, folder path, variable `type`, mode count). Standard names like `color-tokens.json` are **not** required.

After copying exports, run:

```bash
node scripts/discover-figma-raw.mjs
bun run tokens:generate
```

Template stubs (`color-tokens.json`, etc.) let CI and Argent run before real tokens arrive. Replace them in Phase B.
