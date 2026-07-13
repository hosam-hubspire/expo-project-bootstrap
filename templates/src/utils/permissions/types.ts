import type { PermissionResponse } from "expo-modules-core";

/** Normalized permission result used across all helpers in this module. */
export type PermissionOutcome = {
  granted: boolean;
  status: PermissionResponse["status"];
  canAskAgain: boolean;
};

export function toPermissionOutcome(response: PermissionResponse): PermissionOutcome {
  return {
    granted: response.granted,
    status: response.status,
    canAskAgain: response.canAskAgain,
  };
}

export type MediaLibraryAccessOptions = {
  /** Request write-only access (e.g. saving without reading the library). */
  writeOnly?: boolean;
};
