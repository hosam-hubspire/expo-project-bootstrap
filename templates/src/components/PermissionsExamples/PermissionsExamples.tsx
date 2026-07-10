import { useCallback, useEffect, useState } from "react";
import { Pressable, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  ensureBackgroundLocationPermission,
  ensureCameraPermission,
  ensureForegroundLocationPermission,
  ensureMediaLibraryPermission,
  ensureMicrophonePermission,
  ensureNotificationPermission,
  getBackgroundLocationPermission,
  getCameraPermission,
  getForegroundLocationPermission,
  getMediaLibraryPermission,
  getMicrophonePermission,
  getNotificationPermission,
  isLocationServicesEnabled,
  openAppSettings,
  type PermissionOutcome,
} from "@/utils/permissions";

type RowProps = {
  label: string;
  statusLabel: string;
  requestLabel: string;
  openSettingsLabel: string;
  status: PermissionOutcome | null;
  extra?: string | null;
  onRefresh: () => Promise<void>;
  onRequest: () => Promise<PermissionOutcome>;
};

function PermissionRow({
  label,
  statusLabel,
  requestLabel,
  openSettingsLabel,
  status,
  extra,
  onRefresh,
  onRequest,
}: RowProps) {
  const statusText = status
    ? `${status.status}${status.granted ? " · granted" : ""}${
        status.canAskAgain === false ? " · open settings" : ""
      }`
    : "…";

  return (
    <View className="gap-xs border-t border-stroke-default pt-sm">
      <View className="gap-2xs">
        <ThemedText variant="global-body-small-bold">{label}</ThemedText>
        <ThemedText variant="global-body-xxs" colorToken="text-text-secondary">
          {statusLabel}: {statusText}
          {extra ? ` · ${extra}` : ""}
        </ThemedText>
      </View>
      <View className="flex-row flex-wrap gap-xs">
        <Pressable
          onPress={() => {
            void onRefresh();
          }}
          className="min-h-10 flex-1 items-center justify-center rounded-input border border-stroke-default bg-surface-default px-sm py-xs active:opacity-80"
          accessibilityRole="button"
        >
          <ThemedText variant="global-body-small-bold">{statusLabel}</ThemedText>
        </Pressable>
        <Pressable
          onPress={() => {
            void onRequest().then(() => onRefresh());
          }}
          className="min-h-10 flex-1 items-center justify-center rounded-input border border-stroke-default bg-surface-default px-sm py-xs active:opacity-80"
          accessibilityRole="button"
        >
          <ThemedText variant="global-body-small-bold">{requestLabel}</ThemedText>
        </Pressable>
        {status && !status.granted && status.canAskAgain === false ? (
          <Pressable
            onPress={() => {
              void openAppSettings();
            }}
            className="min-h-10 flex-1 items-center justify-center rounded-input border border-button-button-primary bg-surface-default px-sm py-xs active:opacity-80"
            accessibilityRole="button"
          >
            <ThemedText variant="global-body-small-bold">{openSettingsLabel}</ThemedText>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

export type PermissionsExamplesProps = {
  title: string;
  description: string;
  statusLabel: string;
  requestLabel: string;
  openSettingsLabel: string;
  /** Only include keys for permissions selected at intake; trim unused imports/rows. */
  labels: {
    microphone?: string;
    locationForeground?: string;
    locationBackground?: string;
    locationServices?: string;
    notifications?: string;
    camera?: string;
    mediaLibrary?: string;
  };
};

/**
 * Settings demo: status + request for each enabled permission.
 * Copy when any permission toggle is on; trim unused rows/imports to match intake.
 */
export function PermissionsExamples({
  title,
  description,
  statusLabel,
  requestLabel,
  openSettingsLabel,
  labels,
}: PermissionsExamplesProps) {
  const [microphone, setMicrophone] = useState<PermissionOutcome | null>(null);
  const [locationForeground, setLocationForeground] =
    useState<PermissionOutcome | null>(null);
  const [locationBackground, setLocationBackground] =
    useState<PermissionOutcome | null>(null);
  const [servicesEnabled, setServicesEnabled] = useState<boolean | null>(null);
  const [notifications, setNotifications] = useState<PermissionOutcome | null>(null);
  const [camera, setCamera] = useState<PermissionOutcome | null>(null);
  const [mediaLibrary, setMediaLibrary] = useState<PermissionOutcome | null>(null);

  const servicesExtra =
    labels.locationServices && servicesEnabled != null
      ? `${labels.locationServices}: ${servicesEnabled ? "on" : "off"}`
      : null;

  const refreshMicrophone = useCallback(async () => {
    if (!labels.microphone) return;
    setMicrophone(await getMicrophonePermission());
  }, [labels.microphone]);

  const refreshLocationForeground = useCallback(async () => {
    if (!labels.locationForeground) return;
    setLocationForeground(await getForegroundLocationPermission());
    if (labels.locationServices) {
      setServicesEnabled(await isLocationServicesEnabled());
    }
  }, [labels.locationForeground, labels.locationServices]);

  const refreshLocationBackground = useCallback(async () => {
    if (!labels.locationBackground) return;
    setLocationBackground(await getBackgroundLocationPermission());
    if (labels.locationServices) {
      setServicesEnabled(await isLocationServicesEnabled());
    }
  }, [labels.locationBackground, labels.locationServices]);

  const refreshNotifications = useCallback(async () => {
    if (!labels.notifications) return;
    setNotifications(await getNotificationPermission());
  }, [labels.notifications]);

  const refreshCamera = useCallback(async () => {
    if (!labels.camera) return;
    setCamera(await getCameraPermission());
  }, [labels.camera]);

  const refreshMediaLibrary = useCallback(async () => {
    if (!labels.mediaLibrary) return;
    setMediaLibrary(await getMediaLibraryPermission());
  }, [labels.mediaLibrary]);

  useEffect(() => {
    void refreshMicrophone();
    void refreshLocationForeground();
    void refreshLocationBackground();
    void refreshNotifications();
    void refreshCamera();
    void refreshMediaLibrary();
  }, [
    refreshCamera,
    refreshLocationBackground,
    refreshLocationForeground,
    refreshMediaLibrary,
    refreshMicrophone,
    refreshNotifications,
  ]);

  const shared = { statusLabel, requestLabel, openSettingsLabel };

  return (
    <ThemedView colorToken="surface-secondary" className="gap-sm rounded-panel p-base">
      <View className="gap-2xs">
        <ThemedText variant="global-body-small-bold">{title}</ThemedText>
        <ThemedText variant="global-body-small" colorToken="text-text-secondary">
          {description}
        </ThemedText>
      </View>

      {labels.microphone ? (
        <PermissionRow
          {...shared}
          label={labels.microphone}
          status={microphone}
          onRefresh={refreshMicrophone}
          onRequest={ensureMicrophonePermission}
        />
      ) : null}

      {labels.locationForeground ? (
        <PermissionRow
          {...shared}
          label={labels.locationForeground}
          status={locationForeground}
          extra={servicesExtra}
          onRefresh={refreshLocationForeground}
          onRequest={ensureForegroundLocationPermission}
        />
      ) : null}

      {labels.locationBackground ? (
        <PermissionRow
          {...shared}
          label={labels.locationBackground}
          status={locationBackground}
          extra={servicesExtra}
          onRefresh={refreshLocationBackground}
          onRequest={ensureBackgroundLocationPermission}
        />
      ) : null}

      {labels.notifications ? (
        <PermissionRow
          {...shared}
          label={labels.notifications}
          status={notifications}
          onRefresh={refreshNotifications}
          onRequest={ensureNotificationPermission}
        />
      ) : null}

      {labels.camera ? (
        <PermissionRow
          {...shared}
          label={labels.camera}
          status={camera}
          onRefresh={refreshCamera}
          onRequest={ensureCameraPermission}
        />
      ) : null}

      {labels.mediaLibrary ? (
        <PermissionRow
          {...shared}
          label={labels.mediaLibrary}
          status={mediaLibrary}
          onRefresh={refreshMediaLibrary}
          onRequest={ensureMediaLibraryPermission}
        />
      ) : null}
    </ThemedView>
  );
}
