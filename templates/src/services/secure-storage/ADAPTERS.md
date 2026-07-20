# Secure storage adapters

Scaffold ships an imperative `secureStorage.*` API and a swappable `SecureStorageAdapter`. Used by Auth (`useStorageState`), Apollo auth link, and REST Bearer interceptor — independent of React session context.

**Default:** `expo-secure-store` via `createExpoSecureStoreAdapter`.

## Usage

```ts
import { secureStorage } from "@/services/secure-storage";
import { SESSION_STORAGE_KEY } from "@/constants/session";

await secureStorage.setItem(SESSION_STORAGE_KEY, token);
const token = await secureStorage.getItem(SESSION_STORAGE_KEY);
await secureStorage.deleteItem(SESSION_STORAGE_KEY);
```

## Swap a vendor

```ts
import { createMemorySecureStorageAdapter, secureStorage } from "@/services/secure-storage";

secureStorage.setAdapter(createMemorySecureStorageAdapter());
```

Call before session / API clients read the token (app entry or test setup).

## Auth identity note

`SessionProvider` writes the session via `useStorageState` → `secureStorage`. GraphQL/REST read the same key from `secureStorage` — do not wire transport to React context.

## Custom (e.g. encrypted MMKV)

Implement `SecureStorageAdapter` and `secureStorage.setAdapter(...)`. Prefer a real secure enclave / Keychain-backed store for production tokens.
