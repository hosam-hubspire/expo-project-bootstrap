import type { AnalyticsAdapter } from "../types";

/** No-op adapter for production until a real vendor is wired. See ADAPTERS.md. */
export function createNoopAnalyticsAdapter(): AnalyticsAdapter {
  return {
    init() {},
    track() {},
    identify() {},
    screen() {},
    reset() {},
  };
}
