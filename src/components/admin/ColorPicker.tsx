'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

// Thai government color palettes
const governmentPalettes = {
  'ราชการมาตรฐาน': ['#1e40af', '#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'],
  'ทองพระราชนิยม': ['#b45309', '#d97706', '#f59e0b', '#fbbf24', '#fde68a', '#fef3c7'],
  'เขียวธรรมชาติ': ['#166534', '#15803d', '#22c55e', '#4ade80', '#86efac', '#dcfce7'],
  'แดงชาติ': ['#991b1b', '#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fee2e2'],
  'ม่วงศักดิ์สิทธิ์': ['#6b21a8', '#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ede9fe'],
  'ส้มพลังงาน': ['#c2410c', '#ea580c', '#f97316', '#fb923c', '#fdba74', '#ffedd5'],
};

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'picker' | 'palettes'>('picker');

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 rounded-lg border-2 border-gray-300 shadow-sm cursor-pointer hover:border-gov-500 transition-colors"
          style={{ backgroundColor: value }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-28 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gov-500 focus:border-gov-500 font-mono"
          placeholder="#000000"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 p-4">
          {/* Tabs */}
          <div className="flex gap-1 mb-3 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setActiveTab('picker')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'picker' ? 'bg-white shadow text-gov-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              เลือกสี
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('palettes')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'palettes' ? 'bg-white shadow text-gov-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              จานสีราชการ
            </button>
          </div>

          {activeTab === 'picker' ? (
            <div>
              <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-40 rounded-lg cursor-pointer border-0 p-0"
              />
              <div className="mt-3 flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-md border border-gray-200"
                  style={{ backgroundColor: value }}
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md font-mono"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {Object.entries(governmentPalettes).map(([name, colors]) => (
                <div key={name}>
                  <p className="text-xs font-medium text-gray-600 mb-1.5">{name}</p>
                  <div className="flex gap-1.5">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => {
                          onChange(color);
                          setIsOpen(false);
                        }}
                        className="w-9 h-9 rounded-md border border-gray-200 hover:scale-110 transition-transform relative"
                        style={{ backgroundColor: color }}
                      >
                        {value === color && (
                          <Check className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="mt-3 w-full py-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-md"
          >
            ปิด
          </button>
        </div>
      )}
    </div>
  );
}
