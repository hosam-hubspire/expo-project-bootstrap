/**
 * Default iOS Info.plist usage-description strings for Expo config plugins.
 *
 * Customize copy for your product before shipping. Merge the relevant entries
 * into `app.json` plugins (see `templates/src/utils/permissions/README.md`).
 *
 * `$(PRODUCT_NAME)` is replaced by Expo prebuild with the app display name.
 */
export const IOS_PERMISSION_STRINGS = {
  microphone: {
    NSMicrophoneUsageDescription:
      "Allow $(PRODUCT_NAME) to access your microphone to record audio and video.",
  },
  locationForeground: {
    NSLocationWhenInUseUsageDescription:
      "Allow $(PRODUCT_NAME) to use your location while you are using the app.",
  },
  locationBackground: {
    NSLocationAlwaysAndWhenInUseUsageDescription:
      "Allow $(PRODUCT_NAME) to use your location to provide features even when the app is in the background.",
    NSLocationAlwaysUsageDescription:
      "Allow $(PRODUCT_NAME) to use your location to provide features even when the app is in the background.",
  },
  imagePicker: {
    photosPermission:
      "Allow $(PRODUCT_NAME) to access your photos to let you choose images and videos.",
    cameraPermission: "Allow $(PRODUCT_NAME) to access your camera to take photos and videos.",
    microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone when recording video.",
  },
} as const;

export type IosPermissionKey = keyof typeof IOS_PERMISSION_STRINGS;
