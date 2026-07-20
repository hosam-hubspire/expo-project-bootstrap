import { createConsoleAnalyticsAdapter } from "./adapters/console";
import { createNoopAnalyticsAdapter } from "./adapters/noop";
import type { AnalyticsAdapter, AnalyticsProperties, AnalyticsTraits } from "./types";

let adapter: AnalyticsAdapter = createDefaultAdapter();
let initialized = false;

/** Default: console in `__DEV__`, noop in production. Override via `setAdapter`. */
export function createDefaultAdapter(): AnalyticsAdapter {
  return __DEV__ ? createConsoleAnalyticsAdapter() : createNoopAnalyticsAdapter();
}

/**
 * Replace the active adapter (e.g. Firebase / Mixpanel). Call before or instead of `init`
 * when swapping vendors — see ADAPTERS.md.
 */
export function setAdapter(next: AnalyticsAdapter): void {
  adapter = next;
  initialized = false;
}

/** Idempotent init — call once from the root layout. */
export async function init(): Promise<void> {
  if (initialized) {
    return;
  }
  initialized = true;
  await adapter.init?.();
}

function ensureReady(): void {
  if (!initialized) {
    initialized = true;
    void adapter.init?.();
  }
}

/** Imperative analytics API — stable across vendor swaps. */
export const analytics = {
  init,
  setAdapter,
  track(event: string, properties?: AnalyticsProperties) {
    ensureReady();
    adapter.track(event, properties);
  },
  identify(userId: string, traits?: AnalyticsTraits) {
    ensureReady();
    adapter.identify(userId, traits);
  },
  screen(name: string, properties?: AnalyticsProperties) {
    ensureReady();
    adapter.screen(name, properties);
  },
  reset() {
    ensureReady();
    adapter.reset();
  },
};
