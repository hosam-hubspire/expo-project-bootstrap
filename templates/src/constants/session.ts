/**
 * Secure storage key for the auth session token.
 * Used by SessionProvider and API auth (Apollo link / axios interceptor) via `secureStorage` — not React context.
 */
export const SESSION_STORAGE_KEY = "session";
