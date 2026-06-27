import { MMKVWrapper } from "apollo3-cache-persist";
import { createMMKV } from "react-native-mmkv";

const apolloMmkv = createMMKV({ id: "apollo-cache" });

export const apolloCacheStorage = new MMKVWrapper({
  set: (key, value) => {
    apolloMmkv.set(key, value);
  },
  getString: (key) => apolloMmkv.getString(key),
  delete: (key) => {
    apolloMmkv.remove(key);
  },
});

export const APOLLO_CACHE_PERSIST_KEY = "apollo-cache-persist";
