import { Tabs } from "expo-router";

import { Icon } from "@/components/Icon";
import { useColorTokens } from "@/hooks/use-token-color";

export default function AppTabs() {
  const colors = useColorTokens();

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
          title: "Home",
          tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => <Icon name="settings" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
