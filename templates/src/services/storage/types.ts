/**
 * Sync key-value storage contract (MMKV-shaped).
 * Swap MMKV / memory / other sync backends via `setStorageAdapterFactory`.
 * For async-only backends (AsyncStorage), wrap with an in-memory cache or adapt Zustand separately — see ADAPTERS.md.
 */
export type StorageAdapter = {
  getString: (key: string) => string | undefined | null;
  set: (key: string, value: string) => void;
  remove: (key: string) => void;
};

export type StorageAdapterFactory = (id: string) => StorageAdapter;
