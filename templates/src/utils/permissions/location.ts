import * as Location from "expo-location";
import { Platform } from "react-native";

import { toPermissionOutcome, type PermissionOutcome } from "./types";

export type LocationReadyOutcome = PermissionOutcome & {
  servicesEnabled: boolean;
  providerStatus: Location.LocationProviderStatus | null;
};

export type EnsureLocationReadyOptions = {
  /** Request background ("Always") access after foreground is granted. */
  background?: boolean;
  /**
   * Android only: prompt the user to enable high-accuracy location mode
   * (Wi‑Fi, cell, and GPS). Ignored on iOS.
   */
  enableNetworkProvider?: boolean;
};

export async function getForegroundLocationPermission(): Promise<PermissionOutcome> {
  return toPermissionOutcome(await Location.getForegroundPermissionsAsync());
}

export async function requestForegroundLocationPermission(): Promise<PermissionOutcome> {
  return toPermissionOutcome(
    await Location.requestForegroundPermissionsAsync(),
  );
}

export async function ensureForegroundLocationPermission(): Promise<PermissionOutcome> {
  const current = await getForegroundLocationPermission();
  if (current.granted) {
    return current;
  }
  return requestForegroundLocationPermission();
}

export async function getBackgroundLocationPermission(): Promise<PermissionOutcome> {
  return toPermissionOutcome(await Location.getBackgroundPermissionsAsync());
}

export async function requestBackgroundLocationPermission(): Promise<PermissionOutcome> {
  return toPermissionOutcome(
    await Location.requestBackgroundPermissionsAsync(),
  );
}

/**
 * Requests foreground access first, then background ("Always") access.
 * Background tracking requires a dev build and `UIBackgroundModes: location`.
 */
export async function ensureBackgroundLocationPermission(): Promise<PermissionOutcome> {
  const foreground = await ensureForegroundLocationPermission();
  if (!foreground.granted) {
    return foreground;
  }

  const background = await getBackgroundLocationPermission();
  if (background.granted) {
    return background;
  }
  return requestBackgroundLocationPermission();
}

/** Whether the user has location services enabled at the OS level (GPS / Location toggle). */
export async function isLocationServicesEnabled(): Promise<boolean> {
  return Location.hasServicesEnabledAsync();
}

/** Detailed provider status (GPS, network, and whether services are enabled). */
export async function getLocationProviderStatus(): Promise<Location.LocationProviderStatus> {
  return Location.getProviderStatusAsync();
}

/**
 * Android only: asks the user to turn on improved-accuracy location mode.
 * No-op on iOS. Rejects if the user declines the system dialog.
 */
export async function promptAndroidNetworkLocationProvider(): Promise<void> {
  if (Platform.OS !== "android") {
    return;
  }
  await Location.enableNetworkProviderAsync();
}

function toLocationReadyOutcome(
  permission: PermissionOutcome,
  servicesEnabled: boolean,
  providerStatus: Location.LocationProviderStatus | null,
): LocationReadyOutcome {
  return {
    ...permission,
    servicesEnabled,
    providerStatus,
  };
}

/**
 * Ensures app location permission and that device location services are on.
 * Use before `getCurrentPositionAsync` or similar APIs.
 */
export async function ensureLocationReady(
  options: EnsureLocationReadyOptions = {},
): Promise<LocationReadyOutcome> {
  const permission = options.background
    ? await ensureBackgroundLocationPermission()
    : await ensureForegroundLocationPermission();

  if (!permission.granted) {
    return toLocationReadyOutcome(permission, false, null);
  }

  const providerStatus = await getLocationProviderStatus();
  const servicesEnabled = providerStatus.locationServicesEnabled;

  if (!servicesEnabled) {
    return toLocationReadyOutcome(permission, false, providerStatus);
  }

  if (options.enableNetworkProvider) {
    await promptAndroidNetworkLocationProvider();
  }

  return toLocationReadyOutcome(permission, true, providerStatus);
}
