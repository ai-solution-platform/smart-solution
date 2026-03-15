'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, ChevronDown, ChevronRight, Search, Globe } from 'lucide-react';
import type { NavItem } from '@/types';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  language: 'TH' | 'EN';
  onLanguageChange: (lang: 'TH' | 'EN') => void;
  organizationName: string;
  organizationType: string;
  logo?: string;
}

export default function MobileNav({
  isOpen,
  onClose,
  navItems,
  language,
  onLanguageChange,
  organizationName,
  organizationType,
  logo,
}: MobileNavProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // Prevent body scroll when nav is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-[70] transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="เมนูนำทาง"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-primary text-white">
            <div className="flex items-center gap-3">
              {logo ? (
                <img src={logo} alt="" className="h-10 w-auto" />
              ) : (
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg">
                  {organizationName.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-xs text-white/70">{organizationType}</p>
                <p className="font-semibold text-sm">{organizationName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
              aria-label="ปิดเมนู"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-100">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาข้อมูล..."
                className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                aria-label="ค้นหาข้อมูล"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-primary text-white"
                aria-label="ค้นหา"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto" aria-label="เมนูนำทาง">
            <ul className="py-2">
              {navItems.map((item) => (
                <li key={item.label} className="border-b border-gray-50">
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => toggleExpanded(item.label)}
                        className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-gray-50 transition-colors"
                        aria-expanded={expandedItems.has(item.label)}
                      >
                        <span className="font-medium text-text-primary">
                          {language === 'EN' && item.labelEn
                            ? item.labelEn
                            : item.label}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-text-muted transition-transform ${
                            expandedItems.has(item.label) ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {/* Submenu */}
                      <div
                        className={`overflow-hidden transition-all duration-200 ${
                          expandedItems.has(item.label)
                            ? 'max-h-96 opacity-100'
                            : 'max-h-0 opacity-0'
                        }`}
                      >
                        <ul className="bg-gray-50 py-1">
                          {item.children.map((child) => (
                            <li key={child.label}>
                              <Link
                                href={child.href || '/'}
                                className="flex items-center gap-2 px-8 py-3 text-sm text-text-secondary hover:text-primary hover:bg-primary/5 transition-colors"
                                onClick={onClose}
                              >
                                <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                                {language === 'EN' && child.labelEn
                                  ? child.labelEn
                                  : child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href || '/'}
                      className="block px-5 py-3.5 font-medium text-text-primary hover:bg-gray-50 transition-colors"
                      onClick={onClose}
                    >
                      {language === 'EN' && item.labelEn
                        ? item.labelEn
                        : item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom: Language Toggle */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center justify-center gap-3">
              <Globe className="w-4 h-4 text-text-muted" />
              <button
                onClick={() => onLanguageChange('TH')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  language === 'TH'
                    ? 'bg-primary text-white'
                    : 'bg-white text-text-secondary border border-gray-300 hover:border-primary'
                }`}
              >
                ภาษาไทย
              </button>
              <button
                onClick={() => onLanguageChange('EN')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  language === 'EN'
                    ? 'bg-primary text-white'
                    : 'bg-white text-text-secondary border border-gray-300 hover:border-primary'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
