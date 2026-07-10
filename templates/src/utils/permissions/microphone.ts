import { AudioModule } from "expo-audio";

import { toPermissionOutcome, type PermissionOutcome } from "./types";

export async function getMicrophonePermission(): Promise<PermissionOutcome> {
  return toPermissionOutcome(await AudioModule.getRecordingPermissionsAsync());
}

export async function requestMicrophonePermission(): Promise<PermissionOutcome> {
  return toPermissionOutcome(
    await AudioModule.requestRecordingPermissionsAsync(),
  );
}

/** Returns the current status, or prompts the user when not yet granted. */
export async function ensureMicrophonePermission(): Promise<PermissionOutcome> {
  const current = await getMicrophonePermission();
  if (current.granted) {
    return current;
  }
  return requestMicrophonePermission();
}
