/**
 * Async secure key-value contract (SecureStore-shaped).
 * Swap expo-secure-store / memory / encrypted stores via `setSecureStorageAdapter`.
 */
export type SecureStorageAdapter = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  deleteItem: (key: string) => Promise<void>;
};
