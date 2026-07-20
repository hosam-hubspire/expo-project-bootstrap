import Toast from "react-native-toast-message";

import type { ToastAdapter, ToastShowOptions, ToastType } from "../types";

/** Default adapter — requires `<AppToast />` mounted in the root layout. */
export function createRnToastMessageAdapter(): ToastAdapter {
  return {
    show(type: ToastType, { title, message, visibilityTime = 4000 }: ToastShowOptions) {
      Toast.show({
        type,
        text1: title,
        text2: message,
        position: "top",
        visibilityTime,
      });
    },
    hide() {
      Toast.hide();
    },
  };
}
