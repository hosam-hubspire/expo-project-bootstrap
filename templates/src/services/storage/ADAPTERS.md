# Storage adapters

Scaffold ships a sync key-value `StorageAdapter` and `createStorage(id)`. Call sites use `@/lib/mmkv` (app prefs) or Apollo cache storage — both go through this layer.

**Default:** `react-native-mmkv` via `createMmkvStorageAdapter`.

## Named stores

```ts
import { createStorage, createZustandStateStorage } from "@/services/storage";

const storage = createStorage("app-storage");
const zustandStorage = createZustandStateStorage(storage);
```

## Swap the backend globally

Call once before any `createStorage` (e.g. Storybook entry, tests):

```ts
import { createMemoryStorageAdapter, setStorageAdapterFactory } from "@/services/storage";

setStorageAdapterFactory((id) => createMemoryStorageAdapter(id));
```

Or implement `StorageAdapter` / `StorageAdapterFactory` for another sync KV store.

## Apollo `MMKVWrapper` ↔ `StorageAdapter`

GraphQL cache persistence uses `apollo3-cache-persist`'s `MMKVWrapper` over `createStorage("apollo-cache")` in `src/services/graphql/apollo-cache-storage.ts`.

`MMKVWrapper` expects an MMKV-shaped interface whose `set` accepts `boolean | string | number`. Our `StorageAdapter.set` is **string-only** (prefs / Zustand JSON). Bridge with `String(value)` when wrapping — do not widen `StorageAdapter` to match Apollo:

```ts
export const apolloCacheStorage = new MMKVWrapper({
  set: (key, value) => {
    apolloStorage.set(key, String(value));
  },
  getString: (key) => apolloStorage.getString(key) ?? undefined,
  delete: (key) => {
    apolloStorage.remove(key);
  },
});
```

Apollo persist writes stringified cache JSON in practice; the coerce keeps TypeScript aligned with the adapter contract.

## AsyncStorage (reference)

AsyncStorage is async; this adapter surface is sync (MMKV / Apollo `MMKVWrapper`). Options:

1. Prefer a sync native store (MMKV, expo-sqlite sync wrappers).
2. Or hydrate an in-memory `StorageAdapter` from AsyncStorage at startup, then flush writes — not shipped by default.

```ts
// Conceptual — not a drop-in without a sync cache layer
import AsyncStorage from "@react-native-async-storage/async-storage";
```

## Custom

Implement `StorageAdapter` and either:

- `setStorageAdapterFactory(() => yourAdapter)` for a single shared store, or
- `setStorageAdapterFactory((id) => createYourAdapter(id))` for per-id isolation.
