import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import id from '../locales/id';
import en from '../locales/en';

const i18n = createInstance();
export const localizationReady = i18n.use(initReactI18next).init({
  resources: { id: { translation: id }, en: { translation: en } },
  lng: 'id',
  fallbackLng: 'id',
  interpolation: { escapeValue: false },
});

export default i18n;
