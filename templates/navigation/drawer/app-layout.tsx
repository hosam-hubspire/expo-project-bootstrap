import { Drawer } from "expo-router/drawer";
import { useTranslation } from "react-i18next";

/**
 * `(app)/_layout` when Drawer is on.
 * - Tabs on: nest `(tabs)` as a drawer screen (header hidden on that item).
 * - Tabs off: list flat screens (`index`, `settings`, …) as drawer items.
 */
export default function AppDrawerLayout() {
  const { t } = useTranslation();

  return (
    <Drawer>
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: t("drawer.home"),
          title: t("drawer.home"),
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="about"
        options={{
          drawerLabel: t("drawer.about"),
          title: t("drawer.about"),
        }}
      />
    </Drawer>
  );
}
