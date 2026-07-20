# Navigation assembly

Compose Expo Router layouts from intake toggles. Copy only what was selected; wire `RootNavigator` guards.

Docs: [Tabs](https://docs.expo.dev/router/advanced/tabs/) · [Drawer](https://docs.expo.dev/router/advanced/drawer/) · [Protected](https://docs.expo.dev/router/advanced/protected/) · [Auth](https://docs.expo.dev/router/advanced/authentication/) · [Nesting](https://docs.expo.dev/router/advanced/nesting-navigators/)

## Toggles

Intake defaults live in [SKILL.md](../../skills/bootstrap/SKILL.md) / [Features](../../README.md#features). Shipped tree = tabs + intro (`templates/src/app/`).

| Toggle | Effect |
|--------|--------|
| Tabs | `(app)/(tabs)/` + `AppTabs` (JS `Tabs`, not Native Tabs) |
| Drawer | `(app)/_layout` = `Drawer`; nest `(tabs)` when tabs on |
| Intro | `(onboarding)/` + `Protected` until `hasCompletedOnboarding` |
| Auth | `sign-in` + `SessionProvider` + `Protected` on `(app)` |

## Target tree (all on)

```
src/app/
  _layout.tsx                 # providers + SplashScreenController + RootNavigator
  sign-in.tsx                 # auth only
  (onboarding)/ …             # intro only
  (app)/
    _layout.tsx               # Drawer or Stack
    (tabs)/ …                 # tabs on
    about.tsx                 # drawer-only sample
```

- Tabs off + drawer on → `navigation/screens/` under `(app)/`
- Tabs + drawer both off → flat screens + Stack
- Intro off → omit `(onboarding)/` + its `Protected`
- Auth off → omit `sign-in`, `SessionProvider`, auth guards; keep `src/constants/session.ts` if GraphQL or REST is on (API session key via `secureStorage`)

## Guard order (outer → inner)

1. `!hasCompletedOnboarding` → `(onboarding)`
2. `hasCompletedOnboarding && !session` → `sign-in` (auth only)
3. `hasCompletedOnboarding && (!auth || !!session)` → `(app)`

Hold splash until prefs (and session, if auth) rehydrate — `SplashScreenController`.

## Nesting

| Tabs | Drawer | `(app)/_layout` | Children |
|------|--------|-----------------|----------|
| on | off | Stack, `headerShown: false` | `(tabs)` |
| on | on | `Drawer` (`expo-router/drawer`) | `(tabs)` + drawer-only screens |
| off | on | `Drawer` | flat screens |
| off | off | Stack | flat screens |

Drawer wraps Tabs when both on. Install peers only (gesture-handler · reanimated · worklets) — [templates/README.md](../README.md). **Expo SDK 56+: never install `@react-navigation/drawer`.** **Never** `headerShown: false` on the `(tabs)` drawer screen (hides hamburger).

## Module map

| Path | When |
|------|------|
| `templates/src/app/` | Always start here |
| `navigation/auth/` | Auth on |
| `navigation/drawer/` | Drawer on |
| `navigation/screens/` | Tabs off |
| `navigation/root/` | Reference only (wired in default `_layout`) |

## Agent checklist

1. Read intake toggles; start from `templates/src/app/`.
2. Intro **off** → delete `(onboarding)/`; remove onboarding `Protected` / `hasCompletedOnboarding` from navigator.
3. Auth **on** → copy auth modules (`session-provider` → `providers/`, `use-storage-state` → `hooks/`, `sign-in` → `app/`); ensure `constants/session.ts`; nest `SessionProvider` inside `AppApolloProvider` when GraphQL; else `SessionProvider` alone; `expo-secure-store` is Core. Transport reads `secureStorage` — do not wire to React context. Auth **off** + GraphQL/REST → still keep `constants/session.ts` for the API client.
4. Drawer **on** → copy drawer; install peers only (no `@react-navigation/drawer`); keep drawer header on `(tabs)`.
5. Tabs **off** → remove `(tabs)/` + `AppTabs`; copy `navigation/screens/`.
6. C2 checks match intake (below).

## C2 smoke expectations

| Feature | Verify |
|---------|--------|
| Intro | First launch onboarding → Complete → main; relaunch skips |
| Tabs | Home ↔ Settings |
| Drawer | Hamburger on Home/tabs; open; navigate |
| Auth | Signed out → sign-in → app; Sign out → sign-in |
