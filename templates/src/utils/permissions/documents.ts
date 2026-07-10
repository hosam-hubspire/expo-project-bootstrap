/**
 * Document picker and app file-system access.
 *
 * `expo-document-picker` uses the system UI and does not require a separate
 * runtime permission prompt. `expo-file-system` reads the app sandbox without
 * extra prompts. Use `ensureMediaLibraryPermission` from `image-picker` when
 * the user needs to pick photos or videos from the device library.
 */
import { Platform } from "react-native";

export type DocumentAccessInfo = {
  requiresRuntimePermission: false;
};

export function getDocumentAccessInfo(): DocumentAccessInfo {
  return { requiresRuntimePermission: false };
}

/** Android may require storage-related declarations for non-picker file IO. */
export function platformRequiresStoragePermission(): boolean {
  return Platform.OS === "android";
}
