import type { ReactNode } from "react";
import { Pressable, type PressableProps, View } from "react-native";

import { Icon, type IconName } from "@/components/Icon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

type SettingsPanelProps = {
  title: string;
  description?: string;
  icon?: IconName;
  children: ReactNode;
  className?: string;
};

/** Card-style settings section: header + interactive content. */
export function SettingsPanel({
  title,
  description,
  icon,
  children,
  className,
}: SettingsPanelProps) {
  return (
    <ThemedView
      colorToken="surface-secondary"
      className={["w-full gap-sm overflow-hidden rounded-panel p-base", className]
        .filter(Boolean)
        .join(" ")}
    >
      <View className="gap-2xs">
        <View className="flex-row items-center gap-xs">
          {icon ? <Icon name={icon} size={18} colorToken="text-text-default" /> : null}
          <ThemedText variant="global-body-small-bold">{title}</ThemedText>
        </View>
        {description ? (
          <ThemedText variant="global-body-small" colorToken="text-text-secondary">
            {description}
          </ThemedText>
        ) : null}
      </View>
      {children}
    </ThemedView>
  );
}

/** Horizontal wrap row for chips / action buttons. */
export function SettingsButtonRow({ children }: { children: ReactNode }) {
  return <View className="flex-row flex-wrap gap-xs">{children}</View>;
}

type SettingsOptionChipProps<T extends string> = {
  label: string;
  value: T;
  selected: boolean;
  onSelect: (value: T) => void;
};

/** Selectable chip in a settings option row (language, theme, …). */
export function SettingsOptionChip<T extends string>({
  label,
  value,
  selected,
  onSelect,
}: SettingsOptionChipProps<T>) {
  return (
    <Pressable
      onPress={() => onSelect(value)}
      className={[
        "min-h-10 flex-1 flex-row items-center justify-center gap-2xs rounded-input border px-sm py-xs active:opacity-80",
        selected
          ? "border-button-button-primary bg-surface-tertiary"
          : "border-stroke-default bg-surface-default",
      ].join(" ")}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      {selected ? <Icon name="check" size={14} colorToken="button-button-primary" /> : null}
      <ThemedText variant="global-body-small-bold">{label}</ThemedText>
    </Pressable>
  );
}

type SettingsActionButtonProps = Omit<PressableProps, "children" | "className"> & {
  label: string;
  /** Emphasize primary / settings CTA (e.g. open system settings). */
  variant?: "default" | "emphasis";
  className?: string;
};

/** Bordered action control used inside panels (toast triggers, permission actions). */
export function SettingsActionButton({
  label,
  variant = "default",
  className,
  ...pressableProps
}: SettingsActionButtonProps) {
  return (
    <Pressable
      {...pressableProps}
      className={[
        "min-h-10 flex-1 items-center justify-center rounded-input border bg-surface-default px-sm py-xs active:opacity-80",
        variant === "emphasis" ? "border-button-button-primary" : "border-stroke-default",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      accessibilityRole="button"
    >
      <ThemedText variant="global-body-small-bold">{label}</ThemedText>
    </Pressable>
  );
}

/** Full-width outline button below panels (sign out, replay onboarding). */
export function SettingsFooterButton({
  label,
  className,
  ...pressableProps
}: SettingsActionButtonProps) {
  return (
    <Pressable
      {...pressableProps}
      className={[
        "w-full items-center rounded-button border border-stroke-default bg-surface-secondary px-base py-sm active:opacity-80",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      accessibilityRole="button"
    >
      <ThemedText variant="global-body-small-bold">{label}</ThemedText>
    </Pressable>
  );
}

type SettingsDetailRowProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

/** Divided row inside a panel (permission status + actions). */
export function SettingsDetailRow({ title, subtitle, children }: SettingsDetailRowProps) {
  return (
    <View className="gap-xs border-t border-stroke-default pt-sm">
      <View className="gap-2xs">
        <ThemedText variant="global-body-small-bold">{title}</ThemedText>
        {subtitle ? (
          <ThemedText variant="global-body-xxs" colorToken="text-text-secondary">
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {children}
    </View>
  );
}
