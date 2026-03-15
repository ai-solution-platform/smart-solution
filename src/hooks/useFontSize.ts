'use client';

import { useState, useEffect, useCallback } from 'react';

export type FontSize = 'small' | 'medium' | 'large';

const FONT_SIZE_KEY = 'smart-website-font-size';

export function useFontSize() {
  const [fontSize, setFontSizeState] = useState<FontSize>('medium');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FONT_SIZE_KEY) as FontSize | null;
      if (stored && ['small', 'medium', 'large'].includes(stored)) {
        setFontSizeState(stored);
        applyFontSize(stored);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  const applyFontSize = (size: FontSize) => {
    if (typeof document === 'undefined') return;
    const html = document.documentElement;
    html.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
    html.classList.add(`font-size-${size}`);
  };

  const setFontSize = useCallback((size: FontSize) => {
    setFontSizeState(size);
    applyFontSize(size);
    try {
      localStorage.setItem(FONT_SIZE_KEY, size);
    } catch {
      // localStorage unavailable
    }
  }, []);

  const increase = useCallback(() => {
    setFontSize(fontSize === 'small' ? 'medium' : 'large');
  }, [fontSize, setFontSize]);

  const decrease = useCallback(() => {
    setFontSize(fontSize === 'large' ? 'medium' : 'small');
  }, [fontSize, setFontSize]);

  const reset = useCallback(() => {
    setFontSize('medium');
  }, [setFontSize]);

  return {
    fontSize,
    setFontSize,
    increase,
    decrease,
    reset,
  };
}
