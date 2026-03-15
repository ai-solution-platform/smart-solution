'use client';

import React, { useRef, useCallback, useEffect, useState } from 'react';

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  disabled?: boolean;
  error?: boolean;
}

export default function OTPInput({
  length = 6,
  onComplete,
  disabled = false,
  error = false,
}: OTPInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(''));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    const otp = values.join('');
    if (otp.length === length && values.every((v) => v !== '')) {
      onComplete(otp);
    }
  }, [values, length, onComplete]);

  const focusInput = useCallback((index: number) => {
    if (index >= 0 && index < length) {
      inputsRef.current[index]?.focus();
      inputsRef.current[index]?.select();
    }
  }, [length]);

  const handleChange = useCallback(
    (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (val && !/^\d$/.test(val)) return;

      setValues((prev) => {
        const next = [...prev];
        next[index] = val;
        return next;
      });

      if (val) {
        focusInput(index + 1);
      }
    },
    [focusInput]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        if (values[index] === '') {
          focusInput(index - 1);
        } else {
          setValues((prev) => {
            const next = [...prev];
            next[index] = '';
            return next;
          });
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        focusInput(index - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        focusInput(index + 1);
      }
    },
    [values, focusInput]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
      if (pasted.length === 0) return;

      const newValues = Array(length).fill('');
      for (let i = 0; i < pasted.length; i++) {
        newValues[i] = pasted[i];
      }
      setValues(newValues);
      focusInput(Math.min(pasted.length, length - 1));
    },
    [length, focusInput]
  );

  return (
    <div className="flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-3" role="group" aria-label="กรอกรหัส OTP">
      {values.map((value, index) => (
        <input
          key={index}
          ref={(el) => { inputsRef.current[index] = el; }}
          type="text"
          inputMode="numeric"
          pattern="\d{1}"
          maxLength={1}
          value={value}
          disabled={disabled}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          aria-label={`รหัส OTP ตัวที่ ${index + 1} จาก ${length}`}
          className={`
            w-10 h-12 sm:w-14 sm:h-16 text-center text-xl sm:text-3xl font-semibold
            rounded-xl border-2 outline-none transition-all duration-200
            ${error
              ? 'border-red-400 bg-red-50 text-red-600 focus:border-red-500 focus:ring-2 focus:ring-red-200'
              : 'border-gray-300 bg-white text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}
          `}
        />
      ))}
    </div>
  );
}
