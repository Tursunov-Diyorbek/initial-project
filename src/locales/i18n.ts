import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import translationUZ from "./uz/translation.json";
import translationKR from "./kr/translation.json";
import translationRU from "./ru/translation.json";

const resources = {
  uz: {
    translation: translationUZ,
  },
  kr: {
    translation: translationKR,
  },
  ru: {
    translation: translationRU,
  },
};

const language = localStorage.getItem("lang");

if (!language) {
  localStorage.setItem("lang", "uz");
}

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("lang") || "uz",

  keySeparator: false,

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
