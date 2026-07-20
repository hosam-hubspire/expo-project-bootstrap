jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(async () => null),
  setItemAsync: jest.fn(async () => undefined),
  deleteItemAsync: jest.fn(async () => undefined),
}));

import {
  createMemorySecureStorageAdapter,
  secureStorage,
  setSecureStorageAdapter,
} from "./index";
import type { SecureStorageAdapter } from "./types";

describe("secureStorage client", () => {
  let mock: jest.Mocked<SecureStorageAdapter>;

  beforeEach(() => {
    mock = {
      getItem: jest.fn(async () => null),
      setItem: jest.fn(async () => undefined),
      deleteItem: jest.fn(async () => undefined),
    };
    setSecureStorageAdapter(mock);
  });

  it("forwards getItem, setItem, and deleteItem", async () => {
    mock.getItem.mockResolvedValueOnce("token");

    await secureStorage.setItem("session", "abc");
    const value = await secureStorage.getItem("session");
    await secureStorage.deleteItem("session");

    expect(mock.setItem).toHaveBeenCalledWith("session", "abc");
    expect(value).toBe("token");
    expect(mock.getItem).toHaveBeenCalledWith("session");
    expect(mock.deleteItem).toHaveBeenCalledWith("session");
  });

  it("memory adapter round-trips values", async () => {
    const memory = createMemorySecureStorageAdapter();
    setSecureStorageAdapter(memory);

    await secureStorage.setItem("k", "v");
    expect(await secureStorage.getItem("k")).toBe("v");
    await secureStorage.deleteItem("k");
    expect(await secureStorage.getItem("k")).toBeNull();
  });
});
