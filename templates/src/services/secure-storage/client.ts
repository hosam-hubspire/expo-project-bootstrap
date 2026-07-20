import { createExpoSecureStoreAdapter } from "./adapters/expo-secure-store";
import type { SecureStorageAdapter } from "./types";

let adapter: SecureStorageAdapter = createExpoSecureStoreAdapter();

/** Replace the active secure storage adapter — see ADAPTERS.md. */
export function setSecureStorageAdapter(next: SecureStorageAdapter): void {
  adapter = next;
}

/** Imperative secure storage API — stable across vendor swaps. */
export const secureStorage = {
  setAdapter: setSecureStorageAdapter,
  getItem: (key: string) => adapter.getItem(key),
  setItem: (key: string, value: string) => adapter.setItem(key, value),
  deleteItem: (key: string) => adapter.deleteItem(key),
};
