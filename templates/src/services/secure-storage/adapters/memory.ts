import type { SecureStorageAdapter } from "../types";

/** In-memory secure storage — tests / Storybook. Not durable across restarts. */
export function createMemorySecureStorageAdapter(): SecureStorageAdapter {
  const map = new Map<string, string>();

  return {
    async getItem(key) {
      return map.get(key) ?? null;
    },
    async setItem(key, value) {
      map.set(key, value);
    },
    async deleteItem(key) {
      map.delete(key);
    },
  };
}
