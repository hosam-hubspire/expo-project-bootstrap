import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import es from "./locales/es.json";

export const supportedLanguages = ["en", "es"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

const resources = {
  en: { translation: en },
  es: { translation: es },
};

const deviceLanguage = Localization.getLocales()[0]?.languageCode ?? "en";
const initialLanguage = supportedLanguages.includes(deviceLanguage as SupportedLanguage)
  ? (deviceLanguage as SupportedLanguage)
  : "en";

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: "v4",
});

export default i18n;
