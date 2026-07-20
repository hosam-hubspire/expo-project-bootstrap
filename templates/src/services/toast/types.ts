export type ToastType = "success" | "error" | "info";

export type ToastShowOptions = {
  title: string;
  message?: string;
  visibilityTime?: number;
};

/**
 * Vendor-agnostic toast contract.
 * Swap react-native-toast-message (or others) by implementing this — call sites stay on `toast.*`.
 */
export type ToastAdapter = {
  show: (type: ToastType, options: ToastShowOptions) => void;
  hide: () => void;
};
