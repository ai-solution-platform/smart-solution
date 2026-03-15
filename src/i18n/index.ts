'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import React from 'react';
import th, { type TranslationKeys } from './th';
import en from './en';

// ---------- Types ----------

export type Locale = 'th' | 'en';

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
        : `${K}`;
    }[keyof T & string]
  : never;

export type TranslationKey = NestedKeyOf<TranslationKeys>;

// ---------- Dictionaries ----------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dictionaries: Record<Locale, any> = { th, en };

// ---------- Helpers ----------

const LOCALE_STORAGE_KEY = 'smart-website-locale';

/**
 * Resolve a dot-separated key against a nested dictionary object.
 * Returns the value string or the key itself when not found.
 */
function resolveKey(obj: Record<string, unknown>, key: string): string {
  const parts = key.split('.');
  let current: unknown = obj;

  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return key;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return typeof current === 'string' ? current : key;
}

// ---------- Standalone helper ----------

/**
 * Get a translated string for a given locale and key.
 * Can be used outside of React components.
 */
export function getTranslation(locale: Locale, key: TranslationKey): string {
  return resolveKey(dictionaries[locale] as unknown as Record<string, unknown>, key);
}

// ---------- Context ----------

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

// ---------- Provider ----------

interface LanguageProviderProps {
  children: ReactNode;
  defaultLocale?: Locale;
}

export function LanguageProvider({ children, defaultLocale = 'th' }: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
      if (stored && (stored === 'th' || stored === 'en')) {
        setLocaleState(stored);
      }
    } catch {
      // localStorage unavailable (SSR / privacy mode)
    }
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      // ignore
    }
    // Update html lang attribute for accessibility
    if (typeof document !== 'undefined') {
      document.documentElement.lang = next;
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      return resolveKey(dictionaries[locale] as unknown as Record<string, unknown>, key);
    },
    [locale],
  );

  return React.createElement(
    LanguageContext.Provider,
    { value: { locale, setLocale, t } },
    children,
  );
}

// ---------- Hook ----------

/**
 * Access the current locale and translation function.
 *
 * ```tsx
 * const { t, locale, setLocale } = useTranslation();
 * <h1>{t('nav.home')}</h1>
 * ```
 */
export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
