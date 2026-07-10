# Navigation assembly

Expo Router layouts are **orthogonal toggles** — compose any combination. Do not ship every module; copy only what intake selected, then wire `RootNavigator` guards.

**Docs:** [Tabs](https://docs.expo.dev/router/advanced/tabs/) · [Drawer](https://docs.expo.dev/router/advanced/drawer/) · [Protected routes](https://docs.expo.dev/router/advanced/protected/) · [Authentication](https://docs.expo.dev/router/advanced/authentication/) · [Nesting](https://docs.expo.dev/router/advanced/nesting-navigators/)

## Intake toggles

| Toggle | Default | Effect |
|--------|---------|--------|
| **Tabs** | on | `(app)/(tabs)/` + `AppTabs` (Expo Router JS [`Tabs`](https://docs.expo.dev/router/advanced/tabs/), not Native Tabs) |
| **Drawer** | off | `(app)/_layout` uses `Drawer`; nest `(tabs)` inside when tabs on |
| **Intro / onboarding** | on | `(onboarding)/` + `Stack.Protected` until `hasCompletedOnboarding` |
| **Protected / auth** | off | `sign-in` + `SessionProvider` + `Stack.Protected` on `(app)` |

**Default combo:** tabs + intro (no drawer, no auth) — matches `templates/src/app/`.

## Target tree (all toggles on)

```
src/app/
  _layout.tsx                 # providers + SplashScreenController + RootNavigator
  sign-in.tsx                 # auth only
  (onboarding)/
    _layout.tsx
    index.tsx
    features.tsx
  (app)/
    _layout.tsx               # Drawer when drawer on; else Stack passthrough
    (tabs)/                   # when tabs on
      _layout.tsx
      index.tsx
      settings.tsx
    about.tsx                 # drawer-only sample when drawer on
```

When **tabs off** and **drawer on**: put `index.tsx` / `settings.tsx` directly under `(app)/` (use `navigation/screens/`).
When **tabs off** and **drawer off**: same flat screens under `(app)/` with a Stack layout.
When **intro off**: omit `(onboarding)/` and its `Protected` block.
When **auth off**: omit `sign-in.tsx`, `SessionProvider`, and auth guards.

## Guard order (root Stack)

Evaluate outermost → innermost. Typical full stack:

1. `!hasCompletedOnboarding` → `(onboarding)`
2. `hasCompletedOnboarding && !session` → `sign-in` (auth only)
3. `hasCompletedOnboarding && (!auth || !!session)` → `(app)`

Hold the native splash until preferences (and session, when auth on) rehydrate — `SplashScreenController`.

## Nesting rules

| Tabs | Drawer | `(app)/_layout` | Children |
|------|--------|-----------------|----------|
| on | off | Stack, `headerShown: false` | `(tabs)` |
| on | on | `Drawer` from `expo-router/drawer` | `(tabs)` + optional drawer-only screens |
| off | on | `Drawer` | `index`, `settings`, … |
| off | off | Stack | `index`, `settings`, … |

Drawer + tabs: **Drawer wraps Tabs** (one drawer item can be the tab navigator). Install drawer deps when drawer is on — see [templates/README.md](../README.md) (`react-native-gesture-handler` / `reanimated` / `worklets` only on SDK 56+; do not add `@react-navigation/drawer`).

**Drawer header + tabs:** do **not** set `headerShown: false` on the `(tabs)` drawer screen. Hiding that header removes the menu (hamburger) icon on Home/Settings even though edge-swipe still opens the drawer. Keep the default drawer header so the toggle is visible; drawer-only screens (e.g. `about`) already show it.

## Module map

| Path | Copy when |
|------|-----------|
| `templates/src/app/` | **Always start here** (default: tabs + intro). Strip/add per toggles. |
| `navigation/auth/` | Protected routes on |
| `navigation/drawer/` | Drawer on |
| `navigation/screens/` | Tabs off (flat home/settings) |
| `navigation/root/` | Reference snippets for `RootNavigator` / splash (already wired in default `_layout`) |

## Agent checklist

1. Read intake toggles.
2. Start from `templates/src/app/` (and shared `src/` components/stores).
3. If intro **off**: delete `(onboarding)/`; remove onboarding `Protected` + `hasCompletedOnboarding` usage from navigator (keep store field optional or remove).
4. If auth **on**: copy `navigation/auth/*` (`session-provider` → `src/providers/`, `use-storage-state` → `src/hooks/`, `sign-in` → `src/app/`); ensure `src/constants/session.ts` exists; nest **`SessionProvider` inside `AppApolloProvider`** when GraphQL is on (else wrap root with `SessionProvider` alone); add sign-in screen + guards; `bunx expo install expo-secure-store` (session persistence). Hooks go under `src/hooks/`, constants under `src/constants/`, not `src/lib/`. Apollo auth link already attaches `Authorization` from SecureStore — do not wire the link to React context.
5. If drawer **on**: copy `navigation/drawer/*`; replace `(app)/_layout`; install drawer deps; if tabs on, keep `(tabs)` nested under drawer with the drawer header **shown** (menu icon — never `headerShown: false` on `(tabs)`).
6. If tabs **off**: remove `(tabs)/` + `AppTabs`; copy `navigation/screens/` into `(app)/`.
7. Update C2 Argent checks: dismiss onboarding if present; verify tabs and/or drawer; sign-in → app when auth on.

## C2 smoke expectations

| Feature | Verify |
|---------|--------|
| Intro | First launch shows onboarding; Complete → main shell; relaunch skips intro |
| Tabs | Home ↔ Settings |
| Drawer | Menu (hamburger) icon visible in header on Home/tabs; tap it (or swipe) to open; navigate to a drawer item |
| Auth | Signed out → sign-in; Sign in → `(app)`; Sign out → sign-in |
