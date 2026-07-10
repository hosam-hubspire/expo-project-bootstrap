import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { toPermissionOutcome, type PermissionOutcome } from "./types";

export async function getNotificationPermission(): Promise<PermissionOutcome> {
  return toPermissionOutcome(await Notifications.getPermissionsAsync());
}

export async function requestNotificationPermission(): Promise<PermissionOutcome> {
  return toPermissionOutcome(await Notifications.requestPermissionsAsync());
}

export async function ensureNotificationPermission(): Promise<PermissionOutcome> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const current = await getNotificationPermission();
  if (current.granted) {
    return current;
  }
  return requestNotificationPermission();
}
