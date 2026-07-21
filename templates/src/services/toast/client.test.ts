jest.mock("react-native-toast-message", () => ({
  __esModule: true,
  default: {
    show: jest.fn(),
    hide: jest.fn(),
  },
}));

import { setToastAdapter, toast } from "./client";
import type { ToastAdapter } from "./types";

function createMockAdapter(): jest.Mocked<ToastAdapter> {
  return {
    show: jest.fn(),
    hide: jest.fn(),
  };
}

describe("toast client", () => {
  let mock: jest.Mocked<ToastAdapter>;

  beforeEach(() => {
    mock = createMockAdapter();
    setToastAdapter(mock);
  });

  it("forwards success, error, info, and hide to the active adapter", () => {
    toast.success("Saved", "All good");
    toast.error("Failed");
    toast.info("Hint", "Details");
    toast.hide();

    expect(mock.show).toHaveBeenCalledWith("success", { title: "Saved", message: "All good" });
    expect(mock.show).toHaveBeenCalledWith("error", { title: "Failed", message: undefined });
    expect(mock.show).toHaveBeenCalledWith("info", { title: "Hint", message: "Details" });
    expect(mock.hide).toHaveBeenCalled();
  });
});
