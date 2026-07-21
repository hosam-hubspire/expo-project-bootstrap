# Toast adapters

Scaffold ships an imperative `toast.*` API and a swappable `ToastAdapter`. Call sites import from `@/services/toast`.

**Default:** `react-native-toast-message` via `createRnToastMessageAdapter`. Mount `<AppToast />` once in the root layout.

## Swap a vendor

1. Install the vendor SDK.
2. Implement `ToastAdapter` (or adapt the snippet below).
3. Replace the host UI (`AppToast`) if the library needs its own React mount.
4. Call once at startup:

```ts
import { toast } from "@/services/toast";
import { createBurntToastAdapter } from "@/services/toast/adapters/burnt";

toast.setAdapter(createBurntToastAdapter());
```

Call sites stay:

```ts
toast.success("Saved");
toast.error("Failed", "Try again");
toast.info("Heads up");
toast.hide();
```

## Burnt (reference)

```bash
bun add burnt@latest
```

```ts
// src/services/toast/adapters/burnt.ts
import * as Burnt from "burnt";

import type { ToastAdapter, ToastShowOptions, ToastType } from "../types";

export function createBurntToastAdapter(): ToastAdapter {
  return {
    show(type: ToastType, { title, message }: ToastShowOptions) {
      const preset = type === "error" ? "error" : type === "success" ? "done" : "none";
      void Burnt.toast({
        title,
        message,
        preset,
      });
    },
    hide() {
      // Burnt has no global hide — no-op
    },
  };
}
```

With Burnt you can omit `<AppToast />` from the root layout.

## Custom / noop

Use `createNoopToastAdapter()` in tests, or implement `ToastAdapter` and pass it to `toast.setAdapter(...)`.
