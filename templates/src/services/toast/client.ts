import { createRnToastMessageAdapter } from "./adapters/rn-toast-message";
import type { ToastAdapter, ToastShowOptions, ToastType } from "./types";

let adapter: ToastAdapter = createRnToastMessageAdapter();

/** Replace the active toast adapter — see ADAPTERS.md. */
export function setToastAdapter(next: ToastAdapter): void {
  adapter = next;
}

function show(type: ToastType, options: ToastShowOptions) {
  adapter.show(type, options);
}

/** Imperative toast API — stable across vendor swaps. Mount `<AppToast />` for the default host. */
export const toast = {
  setAdapter: setToastAdapter,
  success: (title: string, message?: string) => show("success", { title, message }),
  error: (title: string, message?: string) => show("error", { title, message }),
  info: (title: string, message?: string) => show("info", { title, message }),
  hide: () => adapter.hide(),
};
