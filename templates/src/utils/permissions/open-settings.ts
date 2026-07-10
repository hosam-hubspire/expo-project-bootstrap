import { Linking } from "react-native";

/** Opens the app settings screen so the user can enable a denied permission. */
export async function openAppSettings(): Promise<void> {
  await Linking.openSettings();
}
