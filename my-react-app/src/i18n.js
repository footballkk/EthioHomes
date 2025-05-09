import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from '../locales/en/translation.json';
import am from '../locales/am/translation.json';
import om from '../locales/om/translation.json';
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      am: { translation: am },
      om: { translation: om }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });
export default i18n;
