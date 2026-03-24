'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { translations, type TranslationKey } from './translations';
import type { Locale } from '@/types';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: typeof translations[Locale];
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      document.documentElement.lang = newLocale;
    }
  }, []);

  const t = translations[locale];

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
