jest.mock("react-native-mmkv", () => ({
  createMMKV: jest.fn(() => {
    const map = new Map<string, string>();
    return {
      getString: (key: string) => map.get(key),
      set: (key: string, value: string) => {
        map.set(key, value);
      },
      remove: (key: string) => {
        map.delete(key);
      },
    };
  }),
}));

import {
  createMemoryStorageAdapter,
  createStorage,
  createZustandStateStorage,
  setStorageAdapterFactory,
} from "./index";

describe("storage client", () => {
  beforeEach(() => {
    setStorageAdapterFactory((id) => createMemoryStorageAdapter(id));
  });

  it("createStorage isolates named stores", () => {
    const a = createStorage("a");
    const b = createStorage("b");

    a.set("key", "from-a");
    b.set("key", "from-b");

    expect(a.getString("key")).toBe("from-a");
    expect(b.getString("key")).toBe("from-b");
  });

  it("createZustandStateStorage bridges get/set/remove", () => {
    const adapter = createMemoryStorageAdapter("prefs");
    const stateStorage = createZustandStateStorage(adapter);

    stateStorage.setItem("preferences", '{"theme":"dark"}');
    expect(stateStorage.getItem("preferences")).toBe('{"theme":"dark"}');

    stateStorage.removeItem("preferences");
    expect(stateStorage.getItem("preferences")).toBeNull();
  });
});
