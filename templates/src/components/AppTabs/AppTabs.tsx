import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import { useUniwind } from "uniwind";

import { Icon } from "@/components/Icon";
import { colorTokens } from "@/theme/tokens/generated/colors";

export default function AppTabs() {
  const { t } = useTranslation();
  const { theme } = useUniwind();
  const colors = colorTokens[theme === "dark" ? "dark" : "light"];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors["text-text-default"],
        tabBarInactiveTintColor: colors["text-text-secondary"],
        tabBarStyle: {
          backgroundColor: colors["surface-default"],
          borderTopColor: colors["stroke-default"],
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.home"),
          tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("tabs.settings"),
          tabBarIcon: ({ color, size }) => (
            <Icon name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
