import type { StateStorage } from "zustand/middleware";

import { createMmkvStorageAdapter } from "./adapters/mmkv";
import type { StorageAdapter, StorageAdapterFactory } from "./types";

let factory: StorageAdapterFactory = createMmkvStorageAdapter;

/** Replace how named stores are created (e.g. memory for tests). See ADAPTERS.md. */
export function setStorageAdapterFactory(next: StorageAdapterFactory): void {
  factory = next;
}

/** Create a named key-value store via the active factory (default: MMKV). */
export function createStorage(id: string): StorageAdapter {
  return factory(id);
}

/** Zustand `StateStorage` bridge over a `StorageAdapter`. */
export function createZustandStateStorage(adapter: StorageAdapter): StateStorage {
  return {
    setItem: (name, value) => {
      adapter.set(name, value);
    },
    getItem: (name) => adapter.getString(name) ?? null,
    removeItem: (name) => {
      adapter.remove(name);
    },
  };
}
