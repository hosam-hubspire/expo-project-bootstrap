import type { AnalyticsAdapter, AnalyticsProperties, AnalyticsTraits } from "../types";

/** Logs analytics calls in development. Default adapter when `__DEV__` is true. */
export function createConsoleAnalyticsAdapter(): AnalyticsAdapter {
  return {
    init() {
      console.log("[analytics] init (console)");
    },
    track(event: string, properties?: AnalyticsProperties) {
      console.log("[analytics] track", event, properties ?? {});
    },
    identify(userId: string, traits?: AnalyticsTraits) {
      console.log("[analytics] identify", userId, traits ?? {});
    },
    screen(name: string, properties?: AnalyticsProperties) {
      console.log("[analytics] screen", name, properties ?? {});
    },
    reset() {
      console.log("[analytics] reset");
    },
  };
}
