import { Drawer } from "expo-router/drawer";
import { useTranslation } from "react-i18next";

/**
 * `(app)/_layout` when Drawer is on.
 * - Tabs on: nest `(tabs)` as a drawer screen — keep the drawer header visible so
 *   the menu (hamburger) icon is available on Home/Settings (edge-swipe alone is not enough).
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
