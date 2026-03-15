'use client';

import React from 'react';
import {
  Clock,
  Receipt,
  Building2,
  FileDown,
} from 'lucide-react';

// ---------- Types ----------

export interface QuickQuestion {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface QuickQuestionsProps {
  questions?: QuickQuestion[];
  onSelect: (question: string) => void;
  className?: string;
}

// ---------- Default questions ----------

const defaultQuestions: QuickQuestion[] = [
  {
    id: 'office-hours',
    label: 'สอบถามเวลาทำการ',
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  {
    id: 'tax-payment',
    label: 'วิธีชำระภาษี',
    icon: <Receipt className="w-3.5 h-3.5" />,
  },
  {
    id: 'contact-dept',
    label: 'ติดต่อหน่วยงาน',
    icon: <Building2 className="w-3.5 h-3.5" />,
  },
  {
    id: 'download-forms',
    label: 'ดาวน์โหลดแบบฟอร์ม',
    icon: <FileDown className="w-3.5 h-3.5" />,
  },
];

// ---------- Component ----------

export default function QuickQuestions({
  questions = defaultQuestions,
  onSelect,
  className = '',
}: QuickQuestionsProps) {
  return (
    <div className={`px-4 pb-2 ${className}`} role="group" aria-label="คำถามที่พบบ่อย">
      <p className="text-xs text-gray-500 mb-2">คำถามที่พบบ่อย:</p>
      <div className="flex flex-wrap gap-2">
        {questions.map((q) => (
          <button
            key={q.id}
            type="button"
            onClick={() => onSelect(q.label)}
            className="
              inline-flex items-center gap-1.5
              px-3 py-1.5
              text-xs font-medium
              text-blue-700 bg-blue-50 border border-blue-200
              rounded-full
              hover:bg-blue-100 hover:border-blue-300
              focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
              transition-colors duration-150
              cursor-pointer
            "
            aria-label={`ถาม: ${q.label}`}
          >
            {q.icon}
            {q.label}
          </button>
        ))}
      </div>
    </div>
  );
}
