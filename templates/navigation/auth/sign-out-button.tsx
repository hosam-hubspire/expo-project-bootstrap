import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useSession } from "@/providers/session-provider";

/**
 * Drop-in Settings section when Protected routes are on.
 * Import `useSession` and render this block (or inline the Pressable) in settings.tsx.
 */
export function SignOutButton() {
  const { t } = useTranslation();
  const { signOut } = useSession();

  return (
    <Pressable
      onPress={() => {
        signOut();
      }}
      className="items-center rounded-button border border-stroke-default px-base py-sm active:opacity-80"
      accessibilityRole="button"
    >
      <ThemedText variant="global-body-small-bold">{t("settings.signOut")}</ThemedText>
    </Pressable>
  );
}

/** Minimal wrapper if you need a full screen — usually prefer SignOutButton in Settings. */
export default function SignOutScreen() {
  return (
    <ThemedView className="flex-1" colorToken="surface-default">
      <SafeAreaView className="flex-1 justify-center p-base">
        <SignOutButton />
      </SafeAreaView>
    </ThemedView>
  );
}
