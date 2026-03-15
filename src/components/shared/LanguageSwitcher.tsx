'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation, type Locale } from '@/i18n';
import { Globe, ChevronDown } from 'lucide-react';

interface LanguageSwitcherProps {
  /** Visual variant */
  variant?: 'toggle' | 'dropdown' | 'minimal';
  className?: string;
}

export default function LanguageSwitcher({
  variant = 'toggle',
  className = '',
}: LanguageSwitcherProps) {
  const { locale, setLocale } = useTranslation();

  const languages: { code: Locale; label: string; flag: string }[] = [
    { code: 'th', label: 'ไทย', flag: 'TH' },
    { code: 'en', label: 'EN', flag: 'EN' },
  ];

  // ------ Minimal: just text links ------
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-1 text-sm ${className}`} role="group" aria-label="เปลี่ยนภาษา">
        {languages.map((lang, i) => (
          <React.Fragment key={lang.code}>
            {i > 0 && <span className="text-gray-300" aria-hidden="true">|</span>}
            <button
              type="button"
              onClick={() => setLocale(lang.code)}
              className={`
                px-1 py-0.5 rounded transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-400
                ${locale === lang.code
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-500 hover:text-gray-800'
                }
              `}
              aria-label={`เปลี่ยนภาษาเป็น${lang.label}`}
              aria-pressed={locale === lang.code}
            >
              {lang.flag}
            </button>
          </React.Fragment>
        ))}
      </div>
    );
  }

  // ------ Dropdown: select-style dropdown ------
  if (variant === 'dropdown') {
    return <LanguageDropdown locale={locale} setLocale={setLocale} languages={languages} className={className} />;
  }

  // ------ Toggle (default): pill-shaped toggle ------
  return (
    <div
      className={`inline-flex items-center bg-gray-100 rounded-full p-0.5 ${className}`}
      role="radiogroup"
      aria-label="เปลี่ยนภาษา"
    >
      {languages.map((lang) => {
        const isActive = locale === lang.code;
        return (
          <button
            key={lang.code}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={`เปลี่ยนภาษาเป็น${lang.label}`}
            onClick={() => setLocale(lang.code)}
            className={`
              flex items-center gap-1.5
              px-3 py-1.5 rounded-full
              text-xs font-medium
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
              ${isActive
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
              }
            `}
          >
            <Globe className="w-3.5 h-3.5" />
            {lang.flag}
          </button>
        );
      })}
    </div>
  );
}

// ------ Dropdown sub-component (uses hooks, so must be a component) ------

function LanguageDropdown({
  locale,
  setLocale,
  languages,
  className,
}: {
  locale: Locale;
  setLocale: (l: Locale) => void;
  languages: { code: Locale; label: string; flag: string }[];
  className: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = languages.find((l) => l.code === locale) ?? languages[0];

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="
          flex items-center gap-1.5
          px-3 py-1.5 rounded-lg
          text-xs font-medium
          bg-gray-100 hover:bg-gray-200
          transition-colors
          focus:outline-none focus:ring-2 focus:ring-blue-400
        "
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="เปลี่ยนภาษา"
      >
        <Globe className="w-3.5 h-3.5" />
        {current.flag}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="เลือกภาษา"
          className="
            absolute right-0 mt-1 z-50
            bg-white border border-gray-200 rounded-lg shadow-lg
            overflow-hidden min-w-[100px]
          "
        >
          {languages.map((lang) => (
            <li key={lang.code} role="option" aria-selected={locale === lang.code}>
              <button
                type="button"
                onClick={() => {
                  setLocale(lang.code);
                  setOpen(false);
                }}
                className={`
                  w-full text-left px-3 py-2 text-xs font-medium
                  transition-colors
                  ${locale === lang.code
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                {lang.flag} - {lang.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
