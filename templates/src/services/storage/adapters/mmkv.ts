import { createMMKV } from "react-native-mmkv";

import type { StorageAdapter } from "../types";

/** Default sync storage adapter backed by react-native-mmkv. */
export function createMmkvStorageAdapter(id: string): StorageAdapter {
  const mmkv = createMMKV({ id });

  return {
    getString: (key) => mmkv.getString(key),
    set: (key, value) => {
      mmkv.set(key, value);
    },
    remove: (key) => {
      mmkv.remove(key);
    },
  };
}
