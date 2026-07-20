import { useGlobalSearchParams, usePathname } from "expo-router";
import { useEffect, useRef } from "react";

import { analytics } from "./client";

function serializeParams(params: Record<string, string | string[] | undefined>): string {
  const entries = Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => [key, Array.isArray(value) ? value.join(",") : value] as const)
    .sort(([a], [b]) => a.localeCompare(b));

  if (entries.length === 0) {
    return "";
  }

  return entries.map(([key, value]) => `${key}=${value}`).join("&");
}

/**
 * Light Expo Router screen tracking — mount once in the root layout.
 * Fires `analytics.screen` when the pathname or search params change.
 */
export function useAnalyticsScreenTracking(): void {
  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const paramKey = serializeParams(params);
  const lastKey = useRef<string | null>(null);

  useEffect(() => {
    const key = paramKey ? `${pathname}?${paramKey}` : pathname;

    if (lastKey.current === key) {
      return;
    }
    lastKey.current = key;

    const name = pathname === "/" ? "index" : pathname.replace(/^\//, "") || "index";
    analytics.screen(name, paramKey ? { params: paramKey } : undefined);
  }, [pathname, paramKey]);
}
