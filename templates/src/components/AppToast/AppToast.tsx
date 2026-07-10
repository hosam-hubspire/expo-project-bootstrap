import Toast, { type ToastConfig } from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

type ToastContentProps = {
  title?: string;
  message?: string;
  accentClassName: string;
};

function ToastContent({ title, message, accentClassName }: ToastContentProps) {
  if (!title && !message) {
    return null;
  }

  return (
    <ThemedView
      className={`mx-4 rounded-xl border border-stroke-default border-l-4 px-4 py-3 shadow-sm ${accentClassName}`}
      colorToken="surface-default"
    >
      {title ? (
        <ThemedText className="mb-0.5" variant="global-body-small-bold">
          {title}
        </ThemedText>
      ) : null}
      {message ? (
        <ThemedText colorToken="text-text-secondary" variant="global-body-small">
          {message}
        </ThemedText>
      ) : null}
    </ThemedView>
  );
}

const toastConfig: ToastConfig = {
  success: ({ text1, text2 }) => (
    <ToastContent
      accentClassName="border-l-button-button-primary"
      message={text2}
      title={text1}
    />
  ),
  error: ({ text1, text2 }) => (
    <ToastContent accentClassName="border-l-[#DC2626]" message={text2} title={text1} />
  ),
  info: ({ text1, text2 }) => (
    <ToastContent accentClassName="border-l-stroke-default" message={text2} title={text1} />
  ),
};

export function AppToast() {
  const insets = useSafeAreaInsets();

  return <Toast config={toastConfig} topOffset={insets.top + 8} />;
}
