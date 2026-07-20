import { MMKVWrapper } from "apollo3-cache-persist";

import { createStorage } from "@/services/storage";

const apolloStorage = createStorage("apollo-cache");

export const apolloCacheStorage = new MMKVWrapper({
  set: (key, value) => {
    apolloStorage.set(key, value);
  },
  getString: (key) => apolloStorage.getString(key) ?? undefined,
  delete: (key) => {
    apolloStorage.remove(key);
  },
});

export const APOLLO_CACHE_PERSIST_KEY = "apollo-cache-persist";
