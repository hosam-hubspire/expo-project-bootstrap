import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useSession } from "@/providers/session-provider";

/**
 * Public auth screen — place at `src/app/sign-in.tsx` when Protected routes are on.
 * Guarded with `Stack.Protected guard={!session}` in RootNavigator.
 */
export default function SignInScreen() {
  const { t } = useTranslation();
  const { signIn } = useSession();

  return (
    <ThemedView className="flex-1" colorToken="surface-default">
      <SafeAreaView className="flex-1 justify-center gap-base p-base">
        <ThemedText variant="heading-app-section">{t("auth.signInTitle")}</ThemedText>
        <ThemedText variant="global-body-small" colorToken="text-text-secondary">
          {t("auth.signInSubtitle")}
        </ThemedText>
        <Pressable
          onPress={() => {
            signIn();
          }}
          className="items-center rounded-button bg-button-button-primary px-base py-sm active:opacity-80"
          accessibilityRole="button"
        >
          <ThemedText variant="global-body-small-bold" colorToken="surface-default">
            {t("auth.signInAction")}
          </ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}
