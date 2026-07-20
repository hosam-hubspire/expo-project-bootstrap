import {
  analytics,
  createConsoleAnalyticsAdapter,
  createDefaultAdapter,
  createNoopAnalyticsAdapter,
  setAdapter,
} from "./index";
import type { AnalyticsAdapter } from "./types";

function createMockAdapter(): jest.Mocked<AnalyticsAdapter> {
  return {
    init: jest.fn(),
    track: jest.fn(),
    identify: jest.fn(),
    screen: jest.fn(),
    reset: jest.fn(),
  };
}

describe("analytics client", () => {
  let mock: jest.Mocked<AnalyticsAdapter>;

  beforeEach(() => {
    mock = createMockAdapter();
    setAdapter(mock);
  });

  it("forwards track, identify, screen, and reset to the active adapter", () => {
    analytics.track("button_pressed", { screen: "settings" });
    analytics.identify("user-1", { plan: "pro" });
    analytics.screen("Settings", { tab: "main" });
    analytics.reset();

    expect(mock.init).toHaveBeenCalled();
    expect(mock.track).toHaveBeenCalledWith("button_pressed", { screen: "settings" });
    expect(mock.identify).toHaveBeenCalledWith("user-1", { plan: "pro" });
    expect(mock.screen).toHaveBeenCalledWith("Settings", { tab: "main" });
    expect(mock.reset).toHaveBeenCalled();
  });

  it("init is idempotent", async () => {
    await analytics.init();
    await analytics.init();

    expect(mock.init).toHaveBeenCalledTimes(1);
  });

  it("createDefaultAdapter returns console in __DEV__", () => {
    expect(__DEV__).toBe(true);
    const adapter = createDefaultAdapter();
    const consoleAdapter = createConsoleAnalyticsAdapter();
    expect(Object.keys(adapter).sort()).toEqual(Object.keys(consoleAdapter).sort());
  });

  it("createNoopAnalyticsAdapter methods are safe to call", () => {
    const noop = createNoopAnalyticsAdapter();
    expect(() => {
      noop.init?.();
      noop.track("x");
      noop.identify("id");
      noop.screen("Home");
      noop.reset();
    }).not.toThrow();
  });
});
