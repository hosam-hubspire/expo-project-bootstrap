import type { ToastAdapter } from "../types";

/** No-op adapter for tests / Storybook when no toast host is mounted. */
export function createNoopToastAdapter(): ToastAdapter {
  return {
    show() {},
    hide() {},
  };
}
