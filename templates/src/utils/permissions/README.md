# Permissions utilities

Copy only when selected at intake. Each toggle: packages + `app.json` plugin + module files.

## Matrix

| Toggle | Packages | Plugin | Files |
|--------|----------|--------|-------|
| Microphone | `expo-audio` | `expo-audio` | `microphone.ts` |
| Location (fg) | `expo-location` | `expo-location` | `location.ts` |
| Location (bg) | `expo-location` `expo-task-manager` | `expo-location` (+ bg flags) | `location.ts` (implies fg) |
| Notifications | `expo-notifications` | `expo-notifications` | `notifications.ts` |
| Image picker | `expo-image-picker` | `expo-image-picker` | `image-picker.ts` |
| Documents | `expo-document-picker` `expo-file-system` | `expo-document-picker` | `documents.ts` |

Defaults from intake (all off). Background location implies foreground.

**Always** when any on: `types.ts`, `ios-strings.ts`, `open-settings.ts`, `index.ts` (trim exports).

```bash
bunx expo install expo-audio
bunx expo install expo-location
bunx expo install expo-location expo-task-manager   # bg
bunx expo install expo-notifications
bunx expo install expo-image-picker
bunx expo install expo-document-picker expo-file-system
```

## Plugins

Merge into `expo.plugins`. Use strings from `IOS_PERMISSION_STRINGS` in `ios-strings.ts` (customize product copy). Plugin option shapes: Expo docs for each package. Background location needs a development build (not Expo Go on iOS). Image picker covers camera + library — not `expo-camera` / `expo-media-library`.

## Assembly

1. Install packages for selected toggles
2. Merge plugins + iOS strings from `ios-strings.ts`
3. Copy shared files + selected modules; trim `index.ts` exports
4. `bunx expo prebuild` after plugin changes (when native projects exist)
5. Copy `PermissionsExamples/` → Settings import + JSX; keep only selected `labels`; trim unused rows/imports
6. Toast examples always via `ToastExamples` + `SettingsUI/`
7. Bottom sheet examples always via `BottomSheetExamplesRoot` + `BottomSheetExamples`

## API pattern

Each capability: `get*Permission` · `request*Permission` · `ensure*Permission`. Use `openAppSettings()` when `canAskAgain` is false.
