import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Screen } from "@/components/Screen";
import { SettingsFooterButton } from "@/components/SettingsUI";
import { useSession } from "@/providers/session-provider";

/**
 * Drop-in Settings section when Protected routes are on.
 * Import `useSession` and render this block (or inline the Pressable) in settings.tsx.
 */
export function SignOutButton() {
  const { t } = useTranslation();
  const { signOut } = useSession();

  return (
    <SettingsFooterButton
      label={t("settings.signOut")}
      onPress={() => {
        signOut();
      }}
    />
  );
}

/** Minimal wrapper if you need a full screen — usually prefer SignOutButton in Settings. */
export default function SignOutScreen() {
  return (
    <Screen contentClassName="w-full max-w-content self-center justify-center px-lg">
      <View className="gap-base">
        <SignOutButton />
      </View>
    </Screen>
  );
}
