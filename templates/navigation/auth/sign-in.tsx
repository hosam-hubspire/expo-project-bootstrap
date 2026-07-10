import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";

import { Screen } from "@/components/Screen";
import { ThemedText } from "@/components/ThemedText";
import { useSession } from "@/providers/session-provider";

/**
 * Public auth screen — place at `src/app/sign-in.tsx` when Protected routes are on.
 * Guarded with `Stack.Protected guard={!session}` in RootNavigator.
 */
export default function SignInScreen() {
  const { t } = useTranslation();
  const { signIn } = useSession();

  return (
    <Screen
      contentClassName="w-full max-w-content self-center justify-center gap-base px-lg"
      footer={
        <Pressable
          onPress={() => {
            signIn();
          }}
          className="w-full max-w-content items-center self-center rounded-button bg-button-button-primary px-base py-sm active:opacity-80"
          accessibilityRole="button"
        >
          <ThemedText variant="global-body-small-bold" colorToken="surface-default">
            {t("auth.signInAction")}
          </ThemedText>
        </Pressable>
      }
    >
      <View className="gap-xs">
        <ThemedText variant="heading-app-section">{t("auth.signInTitle")}</ThemedText>
        <ThemedText variant="global-body-small" colorToken="text-text-secondary">
          {t("auth.signInSubtitle")}
        </ThemedText>
      </View>
    </Screen>
  );
}
