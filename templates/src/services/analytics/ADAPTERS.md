# Analytics adapters

Scaffold ships an imperative `analytics.*` API and a swappable `AnalyticsAdapter`. Call sites never import a vendor SDK.

**Default:** `__DEV__` → console logging · production → noop.

## Swap a vendor (minimal call-site churn)

1. Install the vendor SDK for your project.
2. Copy an adapter below into `src/services/analytics/adapters/<vendor>.ts` (or write your own implementing `AnalyticsAdapter`).
3. In the root layout (or a single bootstrap module), before/around `analytics.init()`:

```ts
import { analytics } from "@/services/analytics";
import { createMixpanelAnalyticsAdapter } from "@/services/analytics/adapters/mixpanel";

analytics.setAdapter(createMixpanelAnalyticsAdapter());
void analytics.init();
```

`AnalyticsScreenTracker` already calls `init()` — either set the adapter in that component before `init`, or replace the default adapter at module load:

```ts
// e.g. at the top of AnalyticsScreenTracker.tsx or client.ts createDefaultAdapter()
import { createFirebaseAnalyticsAdapter } from "./adapters/firebase";

export function createDefaultAdapter(): AnalyticsAdapter {
  return createFirebaseAnalyticsAdapter();
}
```

Call sites stay:

```ts
analytics.track("button_pressed", { screen: "settings" });
analytics.identify(userId, { plan: "pro" });
analytics.screen("Settings");
analytics.reset();
```

## Auth identity (when Auth is on)

Wire once in your session layer (not shipped by default):

- After successful sign-in: `analytics.identify(userId, traits)`
- On sign-out: `analytics.reset()`

## Firebase (reference)

Install (Expo / RN Firebase — follow current Expo docs for your SDK):

```bash
bunx expo install @react-native-firebase/app @react-native-firebase/analytics
```

Configure native Firebase apps and any required `google-services` / `GoogleService-Info` files.

```ts
// src/services/analytics/adapters/firebase.ts
import analyticsNative from "@react-native-firebase/analytics";

import type { AnalyticsAdapter, AnalyticsProperties, AnalyticsTraits } from "../types";

function toStringMap(
  properties?: AnalyticsProperties | AnalyticsTraits,
): Record<string, string> | undefined {
  if (!properties) {
    return undefined;
  }
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(properties)) {
    if (value === undefined || value === null) {
      continue;
    }
    out[key] = String(value);
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

export function createFirebaseAnalyticsAdapter(): AnalyticsAdapter {
  return {
    async init() {
      await analyticsNative().setAnalyticsCollectionEnabled(true);
    },
    track(event, properties) {
      void analyticsNative().logEvent(event, toStringMap(properties));
    },
    identify(userId, traits) {
      void analyticsNative().setUserId(userId);
      const map = toStringMap(traits);
      if (map) {
        void analyticsNative().setUserProperties(map);
      }
    },
    screen(name, properties) {
      void analyticsNative().logScreenView({
        screen_name: name,
        screen_class: name,
        ...toStringMap(properties),
      });
    },
    reset() {
      void analyticsNative().setUserId(null);
    },
  };
}
```

## Mixpanel (reference)

```bash
bun add mixpanel-react-native@latest
```

Set `EXPO_PUBLIC_MIXPANEL_TOKEN` in `.env` (gitignored).

```ts
// src/services/analytics/adapters/mixpanel.ts
import { Mixpanel } from "mixpanel-react-native";

import type { AnalyticsAdapter, AnalyticsProperties, AnalyticsTraits } from "../types";

const token = process.env.EXPO_PUBLIC_MIXPANEL_TOKEN?.trim() ?? "";

function toProps(
  properties?: AnalyticsProperties | AnalyticsTraits,
): Record<string, string | number | boolean> | undefined {
  if (!properties) {
    return undefined;
  }
  const out: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(properties)) {
    if (value === undefined || value === null) {
      continue;
    }
    out[key] = value;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

export function createMixpanelAnalyticsAdapter(): AnalyticsAdapter {
  const mixpanel = new Mixpanel(token, true);

  return {
    async init() {
      await mixpanel.init();
    },
    track(event, properties) {
      mixpanel.track(event, toProps(properties));
    },
    identify(userId, traits) {
      mixpanel.identify(userId);
      const props = toProps(traits);
      if (props) {
        mixpanel.getPeople().set(props);
      }
    },
    screen(name, properties) {
      mixpanel.track("Screen View", { screen: name, ...toProps(properties) });
    },
    reset() {
      mixpanel.reset();
    },
  };
}
```

## Custom adapter

Implement `AnalyticsAdapter` from `./types` and pass it to `analytics.setAdapter(...)`.
