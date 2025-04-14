'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/i18n';

export default function I18nProvider({ children }) {
  const preferedLanguage = useSelector((state) => state.user?.preferedLanguage);

  useEffect(() => {
    if (preferedLanguage && i18n.language !== preferedLanguage) {
      i18n.changeLanguage(preferedLanguage);
    }
  }, [preferedLanguage]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}