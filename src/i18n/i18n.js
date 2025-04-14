// src/i18n/i18n.js
'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en.json';
import esTranslation from './locales/es.json';

// Inicializa i18next solo si estamos en el navegador
if (typeof window !== 'undefined') {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: {
          translation: enTranslation
        },
        es: {
          translation: esTranslation
        }
      },
      lng: 'en',
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false
      }
    });
}

export default i18n;