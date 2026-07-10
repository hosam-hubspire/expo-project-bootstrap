import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useTranslation } from "react-i18next";
import { useResolveClassNames, withUniwind } from "uniwind";

import {
  accentColorClassName,
  bgClassName,
  colorClassName,
  typographyClassName,
} from "@/theme/typography";

import { TabBarIcon } from "./tab-bar-icons";

const StyledNativeTabs = withUniwind(NativeTabs);

export default function AppTabs() {
  const { t } = useTranslation();

  const tabLabelDefault = useResolveClassNames(
    `${typographyClassName("global-body-xxs")} ${colorClassName("text-text-secondary")}`,
  );
  const tabLabelSelected = useResolveClassNames(
    `${typographyClassName("global-body-xxs-bold")} ${colorClassName("text-text-default")}`,
  );

  return (
    <StyledNativeTabs
      backgroundColorClassName={bgClassName("surface-default")}
      indicatorColorClassName={accentColorClassName("surface-secondary")}
      labelStyle={{
        default: tabLabelDefault,
        selected: tabLabelSelected,
      }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>{t("tabs.home")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={<NativeTabs.Trigger.VectorIcon family={TabBarIcon} name="home" />}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>{t("tabs.settings")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={<NativeTabs.Trigger.VectorIcon family={TabBarIcon} name="settings" />}
        />
      </NativeTabs.Trigger>
    </StyledNativeTabs>
  );
}
