import * as ImagePicker from "expo-image-picker";

import {
  toPermissionOutcome,
  type MediaLibraryAccessOptions,
  type PermissionOutcome,
} from "./types";

export async function getCameraPermission(): Promise<PermissionOutcome> {
  return toPermissionOutcome(await ImagePicker.getCameraPermissionsAsync());
}

export async function requestCameraPermission(): Promise<PermissionOutcome> {
  return toPermissionOutcome(await ImagePicker.requestCameraPermissionsAsync());
}

export async function ensureCameraPermission(): Promise<PermissionOutcome> {
  const current = await getCameraPermission();
  if (current.granted) {
    return current;
  }
  return requestCameraPermission();
}

export async function getMediaLibraryPermission(
  options: MediaLibraryAccessOptions = {},
): Promise<PermissionOutcome> {
  return toPermissionOutcome(
    await ImagePicker.getMediaLibraryPermissionsAsync(options.writeOnly ?? false),
  );
}

export async function requestMediaLibraryPermission(
  options: MediaLibraryAccessOptions = {},
): Promise<PermissionOutcome> {
  return toPermissionOutcome(
    await ImagePicker.requestMediaLibraryPermissionsAsync(
      options.writeOnly ?? false,
    ),
  );
}

export async function ensureMediaLibraryPermission(
  options: MediaLibraryAccessOptions = {},
): Promise<PermissionOutcome> {
  const current = await getMediaLibraryPermission(options);
  if (current.granted) {
    return current;
  }
  return requestMediaLibraryPermission(options);
}
