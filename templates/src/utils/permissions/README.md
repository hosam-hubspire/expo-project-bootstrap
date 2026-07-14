# Permissions utilities

Optional module — copy into the new app only when selected at bootstrap intake. Each toggle installs its Expo packages, merges config plugins into `app.json`, and copies the matching files under `src/utils/permissions/`.

## Intake toggles

| Toggle | Packages (`bunx expo install`) | Config plugin | Copied files |
|--------|-------------------------------|---------------|--------------|
| **Microphone** (audio / video) | `expo-audio` | `expo-audio` | `microphone.ts` |
| **Location (foreground)** | `expo-location` | `expo-location` | `location.ts` |
| **Location (background)** | `expo-location` `expo-task-manager` | `expo-location` (`isIosBackgroundLocationEnabled: true`, `isAndroidBackgroundLocationEnabled: true`) | `location.ts` (same file; implies foreground) |
| **Notifications** | `expo-notifications` | `expo-notifications` | `notifications.ts` |
| **Image picker** (camera + photos/videos) | `expo-image-picker` | `expo-image-picker` | `image-picker.ts` |
| **Documents / file system** | `expo-document-picker` `expo-file-system` | `expo-document-picker` (optional iCloud — see below) | `documents.ts` |

**Defaults:** all off. When **Location (background)** is on, also enable foreground location packages/config.

Always copy shared files when any permission is selected:

- `types.ts`
- `ios-strings.ts`
- `open-settings.ts`
- `index.ts` (trim exports to match selected modules)

Import in app code:

```ts
import {
  ensureCameraPermission,
  ensureMediaLibraryPermission,
  ensureForegroundLocationPermission,
  IOS_PERMISSION_STRINGS,
} from "@/utils/permissions";
```

## Installs

```bash
# Microphone (audio recording, video with audio)
bunx expo install expo-audio

# Location (foreground)
bunx expo install expo-location

# Location (background) — also requires foreground
bunx expo install expo-location expo-task-manager

# Notifications
bunx expo install expo-notifications

# Image picker (camera + photos/videos on device — not expo-media-library)
bunx expo install expo-image-picker

# Documents / file system
bunx expo install expo-document-picker expo-file-system
```

Skip groups for unchecked permission toggles.

## `app.json` plugins

Merge plugin entries into `expo.plugins`. Use strings from `IOS_PERMISSION_STRINGS` in `ios-strings.ts` (customize copy for the product).

### Microphone (`expo-audio`)

```json
[
  "expo-audio",
  {
    "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone to record audio and video."
  }
]
```

### Location (foreground)

```json
[
  "expo-location",
  {
    "locationWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location while you are using the app."
  }
]
```

### Location (background)

```json
[
  "expo-location",
  {
    "locationWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location while you are using the app.",
    "locationAlwaysAndWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location to provide features even when the app is in the background.",
    "isIosBackgroundLocationEnabled": true,
    "isAndroidBackgroundLocationEnabled": true
  }
]
```

Background location requires a **development build** (not Expo Go on iOS).

Location helpers also cover **device-level** checks (separate from app permission):

- `isLocationServicesEnabled()` — OS location/GPS toggle
- `getLocationProviderStatus()` — GPS / network provider availability
- `promptAndroidNetworkLocationProvider()` — Android high-accuracy mode prompt
- `ensureLocationReady()` — app permission + services enabled (optional background / Android network provider)

```ts
const ready = await ensureLocationReady({ enableNetworkProvider: true });
if (!ready.granted) {
  // app permission denied
} else if (!ready.servicesEnabled) {
  // user needs to enable Location in system settings
  await openAppSettings();
}
```

### Notifications

```json
["expo-notifications"]
```

iOS does not require a usage-description string for notification permission. Push setup still needs APNs credentials when using remote notifications.

### Image picker (camera + photos/videos)

Camera and library access use `expo-image-picker` only — not `expo-camera` or `expo-media-library`.

```json
[
  "expo-image-picker",
  {
    "photosPermission": "Allow $(PRODUCT_NAME) to access your photos to let you choose images and videos.",
    "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera to take photos and videos.",
    "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone when recording video."
  }
]
```

### Documents / file system

Basic picker (no iCloud):

```json
["expo-document-picker"]
```

iCloud / Files integration — also set `expo.ios.usesIcloudStorage: true` and configure the `expo-document-picker` plugin per [Expo docs](https://docs.expo.dev/versions/latest/sdk/document-picker/).

## iOS Info.plist keys (reference)

| Key | Used by |
|-----|---------|
| `NSCameraUsageDescription` | Image picker |
| `NSMicrophoneUsageDescription` | Microphone, image picker (video) |
| `NSPhotoLibraryUsageDescription` | Image picker |
| `NSLocationWhenInUseUsageDescription` | Location (foreground) |
| `NSLocationAlwaysAndWhenInUseUsageDescription` | Location (background) |
| `NSLocationAlwaysUsageDescription` | Location (background, legacy) |

Defaults live in `ios-strings.ts`. With CNG / prebuild, config plugins write these keys — manual `Info.plist` edits are not needed.

## Bootstrap assembly

1. Ask permission toggles at intake (`allow_multiple: true`, all unchecked by default).
2. Install packages for selected toggles (see table above).
3. Merge `app.json` plugins with customized strings from `IOS_PERMISSION_STRINGS`.
4. Copy `src/utils/permissions/` shared files + selected modules only.
5. Regenerate `index.ts` exports to match copied modules (remove unused exports).
6. Run `bunx expo prebuild` after plugin changes.

## Settings demo

When any permission is selected, also:

1. Copy `templates/src/components/PermissionsExamples/` → `src/components/PermissionsExamples/`.
2. In Settings (`(tabs)/settings.tsx`, flat `navigation/screens/settings.tsx`, and minimal settings if used): add the `PermissionsExamples` import and JSX (do not leave commented scaffold blocks).
3. Keep only `labels` keys for selected toggles (e.g. omit `camera` / `mediaLibrary` when Image picker is off).
4. Trim unused imports and rows inside `PermissionsExamples.tsx` so missing packages do not break the build.

Toast examples are always on Settings via `ToastExamples` (core). Both demos use `src/components/SettingsUI/` (copy with Settings / ToastExamples).

## API pattern

Each runtime permission exposes:

- `get*Permission()` — read current status
- `request*Permission()` — show the system prompt
- `ensure*Permission()` — get, then request if not granted

Use `openAppSettings()` when `canAskAgain` is `false` and you need the user to enable access manually.
