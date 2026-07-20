import { useEffect } from "react";

import { analytics } from "./client";
import { useAnalyticsScreenTracking } from "./use-analytics-screen-tracking";

/** Mount once in the root layout — inits analytics and tracks Expo Router screens. */
export function AnalyticsScreenTracker() {
  useEffect(() => {
    void analytics.init();
  }, []);

  useAnalyticsScreenTracking();

  return null;
}
