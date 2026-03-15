'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`py-3 px-4 md:px-0 ${className}`}
    >
      <ol className="flex flex-wrap items-center gap-1 text-sm text-text-secondary">
        <li className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-primary transition-colors"
            aria-label="หน้าแรก"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">หน้าแรก</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              <ChevronRight className="w-4 h-4 mx-1 text-text-muted flex-shrink-0" />
              {isLast || !item.href ? (
                <span
                  className="text-text-primary font-medium truncate max-w-[200px] sm:max-w-none"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-primary transition-colors truncate max-w-[200px] sm:max-w-none"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
