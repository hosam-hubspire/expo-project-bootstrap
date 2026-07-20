/** Property bag for track / screen events. */
export type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>;

/** Traits passed to identify. */
export type AnalyticsTraits = Record<string, string | number | boolean | null | undefined>;

/**
 * Vendor-agnostic analytics contract.
 * Swap Firebase, Mixpanel, etc. by implementing this interface — call sites stay on `analytics.*`.
 */
export type AnalyticsAdapter = {
  init?: () => void | Promise<void>;
  track: (event: string, properties?: AnalyticsProperties) => void;
  identify: (userId: string, traits?: AnalyticsTraits) => void;
  screen: (name: string, properties?: AnalyticsProperties) => void;
  reset: () => void;
};
