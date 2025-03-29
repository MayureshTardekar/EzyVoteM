import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "./locales/en/translation.json";
import translationHI from "./locales/hi/translation.json";
import translationMR from "./locales/mr/translation.json";
import translationGU from "./locales/gu/translation.json";
import translationBN from "./locales/bn/translation.json";
import translationTA from "./locales/ta/translation.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: translationEN },
    hi: { translation: translationHI },
    mr: { translation: translationMR },
    gu: { translation: translationGU },
    bn: { translation: translationBN },
    ta: { translation: translationTA },
  },
  lng: "en", // Default language
  fallbackLng: "en", // Fallback language if the selected one is missing
  interpolation: {
    escapeValue: false, // React already escapes values to avoid XSS
  },
});

// Add the language change listener
i18n.on("languageChanged", (lng) => {
  console.log(`Language changed to: ${lng}`);
});

export default i18n;
