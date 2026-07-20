import * as SecureStore from "expo-secure-store";

import type { SecureStorageAdapter } from "../types";

/** Default adapter — expo-secure-store (Keychain / Keystore). */
export function createExpoSecureStoreAdapter(): SecureStorageAdapter {
  return {
    getItem: (key) => SecureStore.getItemAsync(key),
    setItem: (key, value) => SecureStore.setItemAsync(key, value),
    deleteItem: (key) => SecureStore.deleteItemAsync(key),
  };
}
