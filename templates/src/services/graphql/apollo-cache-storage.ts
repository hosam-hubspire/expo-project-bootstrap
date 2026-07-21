import { MMKVWrapper } from "apollo3-cache-persist";

import { createStorage } from "@/services/storage";

const apolloStorage = createStorage("apollo-cache");

// apollo3-cache-persist's MMKVInterface.set accepts boolean | string | number;
// StorageAdapter.set is string-only — coerce so tsc stays happy.
export const apolloCacheStorage = new MMKVWrapper({
  set: (key, value) => {
    apolloStorage.set(key, String(value));
  },
  getString: (key) => apolloStorage.getString(key) ?? undefined,
  delete: (key) => {
    apolloStorage.remove(key);
  },
});

export const APOLLO_CACHE_PERSIST_KEY = "apollo-cache-persist";
