import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Pressable, TextInput, View } from "react-native";
import { KeyboardAwareScrollView, KeyboardToolbar } from "react-native-keyboard-controller";
import { z } from "zod";

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

  const signInSchema = z.object({
    email: z.string().min(1, t("auth.emailRequired")).email(t("auth.emailInvalid")),
    password: z.string().min(1, t("auth.passwordRequired")).min(8, t("auth.passwordMin")),
  });

  type SignInValues = z.infer<typeof signInSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <>
      <Screen
        contentClassName="flex-1"
        footer={
          <Pressable
            onPress={handleSubmit(() => {
              signIn();
            })}
            className="w-full max-w-content items-center self-center rounded-button bg-button-button-primary px-base py-sm active:opacity-80"
            accessibilityRole="button"
          >
            <ThemedText variant="global-body-small-bold" colorToken="surface-default">
              {t("auth.signInAction")}
            </ThemedText>
          </Pressable>
        }
      >
        <KeyboardAwareScrollView
          className="flex-1"
          contentContainerClassName="w-full max-w-content flex-grow justify-center gap-base self-center px-lg"
          keyboardShouldPersistTaps="handled"
          bottomOffset={80}
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-xs">
            <ThemedText variant="heading-app-section">{t("auth.signInTitle")}</ThemedText>
            <ThemedText variant="global-body-small" colorToken="text-text-secondary">
              {t("auth.signInSubtitle")}
            </ThemedText>
          </View>

          <View className="gap-base">
            <View className="gap-2xs">
              <ThemedText variant="global-body-small-bold">{t("auth.emailLabel")}</ThemedText>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    placeholder={t("auth.emailLabel")}
                    accessibilityLabel={t("auth.emailLabel")}
                    className="min-h-10 rounded-input border border-stroke-default bg-surface-default px-sm py-xs text-text-text-default"
                  />
                )}
              />
              {errors.email?.message ? (
                <ThemedText variant="global-body-xxs" colorToken="text-text-secondary">
                  {errors.email.message}
                </ThemedText>
              ) : null}
            </View>

            <View className="gap-2xs">
              <ThemedText variant="global-body-small-bold">{t("auth.passwordLabel")}</ThemedText>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="password"
                    textContentType="password"
                    placeholder={t("auth.passwordLabel")}
                    accessibilityLabel={t("auth.passwordLabel")}
                    className="min-h-10 rounded-input border border-stroke-default bg-surface-default px-sm py-xs text-text-text-default"
                  />
                )}
              />
              {errors.password?.message ? (
                <ThemedText variant="global-body-xxs" colorToken="text-text-secondary">
                  {errors.password.message}
                </ThemedText>
              ) : null}
            </View>
          </View>
        </KeyboardAwareScrollView>
      </Screen>
      <KeyboardToolbar />
    </>
  );
}
