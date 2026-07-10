import Toast from "react-native-toast-message";

type ToastType = "success" | "error" | "info";

type ToastOptions = {
  title: string;
  message?: string;
  visibilityTime?: number;
};

function show(type: ToastType, { title, message, visibilityTime = 4000 }: ToastOptions) {
  Toast.show({
    type,
    text1: title,
    text2: message,
    position: "top",
    visibilityTime,
  });
}

/** Imperative toast API — mount `<AppToast />` once in the root layout. */
export const toast = {
  success: (title: string, message?: string) => show("success", { title, message }),
  error: (title: string, message?: string) => show("error", { title, message }),
  info: (title: string, message?: string) => show("info", { title, message }),
  hide: () => Toast.hide(),
};
