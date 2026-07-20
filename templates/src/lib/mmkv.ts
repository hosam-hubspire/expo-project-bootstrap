import { createStorage, createZustandStateStorage } from "@/services/storage";

/** App-wide KV store (preferences, etc.). Backed by the storage adapter (default MMKV). */
export const storage = createStorage("app-storage");

/** Zustand persist bridge — same adapter as `storage`. */
export const mmkvStorage = createZustandStateStorage(storage);
