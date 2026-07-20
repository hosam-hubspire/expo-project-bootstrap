import type { StorageAdapter } from "../types";

/** In-memory sync storage — tests, Storybook, or Expo Go without native MMKV. */
export function createMemoryStorageAdapter(_id?: string): StorageAdapter {
  const map = new Map<string, string>();

  return {
    getString: (key) => map.get(key),
    set: (key, value) => {
      map.set(key, value);
    },
    remove: (key) => {
      map.delete(key);
    },
  };
}
