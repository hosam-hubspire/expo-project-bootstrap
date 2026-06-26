# Optional add-on blocks

Apply the relevant block when the user requests that capability during bootstrap.

## GraphQL subscriptions

Enable WebSocket subscriptions: set `EXPO_PUBLIC_GRAPHQL_SUBSCRIPTIONS_ENABLED=true` and optionally `EXPO_PUBLIC_GRAPHQL_WS_URL` (defaults to the HTTP endpoint with ws/wss). Keep cache persist and prefetch enabled unless the user says otherwise.

## Storybook

Enable on-device Storybook. Before pushing, confirm tokens render for each theme mode and breakpoint this project supports. Document non-obvious Figma → code mappings in TOKENS.md.

## Figma / tokens only

Run Phase B only (design tokens). One collection per `use_figma` call; persist immediately; token gate must pass before commit. Light-only or single-breakpoint projects are valid — do not add dark or responsive output the Figma file does not define.

## Figma icons only

Run Phase C only (icons) after scaffold + `bun install`. **Read and follow [figma-icons-sync](../figma-icons-sync/SKILL.md)** with the provided Figma icons URL and project root. Document any ambiguous variants (same name, different shape) in the bootstrap summary.

## Device verification (Argent)

Install Argent if needed (`npm i -g @swmansion/argent`), run `npx @swmansion/argent init -y` in the project root during scaffold, then boot iOS simulator and Android emulator, launch the app on both, and confirm no crashes/redboxes and the placeholder shell renders correctly. Report devices used and any issues fixed.
