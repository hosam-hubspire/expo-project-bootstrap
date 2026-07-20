import { useCallback, useEffect, useReducer } from "react";

import { secureStorage } from "@/services/secure-storage";

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(initialValue: [boolean, T | null] = [true, null]): UseStateHook<T> {
  return useReducer(
    (_state: [boolean, T | null], action: T | null = null): [boolean, T | null] => [false, action],
    initialValue,
  ) as UseStateHook<T>;
}

async function setStorageItemAsync(key: string, value: string | null) {
  if (value == null) {
    await secureStorage.deleteItem(key);
  } else {
    await secureStorage.setItem(key, value);
  }
}

/** Persist a string securely via `secureStorage`. Used by SessionProvider. */
export function useStorageState(key: string): UseStateHook<string> {
  const [state, setState] = useAsyncState<string>();

  useEffect(() => {
    void secureStorage.getItem(key).then((value) => {
      setState(value);
    });
  }, [key, setState]);

  const setValue = useCallback(
    (value: string | null) => {
      setState(value);
      void setStorageItemAsync(key, value);
    },
    [key, setState],
  );

  return [state, setValue];
}
