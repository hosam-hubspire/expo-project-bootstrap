import { Drawer } from "expo-router/drawer";
import { useTranslation } from "react-i18next";

/** `(app)/_layout` when Drawer is on and Tabs are off. */
export default function AppDrawerFlatLayout() {
  const { t } = useTranslation();

  return (
    <Drawer>
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: t("drawer.home"),
          title: t("drawer.home"),
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: t("drawer.settings"),
          title: t("drawer.settings"),
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
