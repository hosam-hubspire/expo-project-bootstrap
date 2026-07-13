export {
  type DocumentAccessInfo,
  getDocumentAccessInfo,
  platformRequiresStoragePermission,
} from "./documents";
export {
  ensureCameraPermission,
  ensureMediaLibraryPermission,
  getCameraPermission,
  getMediaLibraryPermission,
  requestCameraPermission,
  requestMediaLibraryPermission,
} from "./image-picker";
export { IOS_PERMISSION_STRINGS, type IosPermissionKey } from "./ios-strings";
export {
  type EnsureLocationReadyOptions,
  ensureBackgroundLocationPermission,
  ensureForegroundLocationPermission,
  ensureLocationReady,
  getBackgroundLocationPermission,
  getForegroundLocationPermission,
  getLocationProviderStatus,
  isLocationServicesEnabled,
  type LocationReadyOutcome,
  promptAndroidNetworkLocationProvider,
  requestBackgroundLocationPermission,
  requestForegroundLocationPermission,
} from "./location";

export {
  ensureMicrophonePermission,
  getMicrophonePermission,
  requestMicrophonePermission,
} from "./microphone";
export {
  ensureNotificationPermission,
  getNotificationPermission,
  requestNotificationPermission,
} from "./notifications";
export { openAppSettings } from "./open-settings";
export type { MediaLibraryAccessOptions, PermissionOutcome } from "./types";
