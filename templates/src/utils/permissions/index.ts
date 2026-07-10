export { IOS_PERMISSION_STRINGS, type IosPermissionKey } from "./ios-strings";
export { openAppSettings } from "./open-settings";
export type { MediaLibraryAccessOptions, PermissionOutcome } from "./types";

export {
  ensureCameraPermission,
  ensureMediaLibraryPermission,
  getCameraPermission,
  getMediaLibraryPermission,
  requestCameraPermission,
  requestMediaLibraryPermission,
} from "./image-picker";

export {
  ensureMicrophonePermission,
  getMicrophonePermission,
  requestMicrophonePermission,
} from "./microphone";

export {
  ensureBackgroundLocationPermission,
  ensureForegroundLocationPermission,
  ensureLocationReady,
  getBackgroundLocationPermission,
  getForegroundLocationPermission,
  getLocationProviderStatus,
  isLocationServicesEnabled,
  promptAndroidNetworkLocationProvider,
  requestBackgroundLocationPermission,
  requestForegroundLocationPermission,
  type EnsureLocationReadyOptions,
  type LocationReadyOutcome,
} from "./location";

export {
  ensureNotificationPermission,
  getNotificationPermission,
  requestNotificationPermission,
} from "./notifications";

export {
  getDocumentAccessInfo,
  platformRequiresStoragePermission,
  type DocumentAccessInfo,
} from "./documents";
