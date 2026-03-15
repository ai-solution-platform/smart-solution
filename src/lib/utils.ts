import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Thai month names
 */
const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
  'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
  'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];

const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.',
  'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.',
  'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
];

/**
 * Format date in Thai format with Buddhist Era year (พ.ศ.)
 * @param date - Date string or Date object
 * @param options - Formatting options
 * @returns Formatted Thai date string
 */
export function formatDate(
  date: string | Date,
  options: { short?: boolean; includeTime?: boolean } = {}
): string {
  const d = new Date(date);
  const day = d.getDate();
  const month = options.short ? THAI_MONTHS_SHORT[d.getMonth()] : THAI_MONTHS[d.getMonth()];
  const year = d.getFullYear() + 543; // Convert to Buddhist Era

  let result = `${day} ${month} ${year}`;

  if (options.includeTime) {
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    result += ` เวลา ${hours}:${minutes} น.`;
  }

  return result;
}

/**
 * Format number as Thai Baht currency
 * @param amount - Amount in Baht
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Generate a URL-safe slug from a Thai or English title
 * @param title - The title to convert to a slug
 * @returns URL-safe slug string
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\u0E00-\u0E7Fa-z0-9\s-]/g, '') // Keep Thai chars, alphanumeric, spaces, hyphens
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Truncate text to a specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum character length (default: 100)
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Generate a tracking number for complaints
 * Format: CMP-YYYY-XXXXX (e.g., CMP-2024-00123)
 * @returns Tracking number string
 */
export function generateTrackingNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 99999)
    .toString()
    .padStart(5, '0');
  return `CMP-${year}-${random}`;
}

/**
 * Get relative time in Thai language
 * @param date - Date string or Date object
 * @returns Relative time string in Thai
 */
export function getRelativeTime(date: string | Date): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) {
    return 'เมื่อสักครู่';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} นาทีที่แล้ว`;
  } else if (diffHours < 24) {
    return `${diffHours} ชั่วโมงที่แล้ว`;
  } else if (diffDays === 1) {
    return 'เมื่อวาน';
  } else if (diffDays < 7) {
    return `${diffDays} วันที่แล้ว`;
  } else if (diffWeeks < 4) {
    return `${diffWeeks} สัปดาห์ที่แล้ว`;
  } else if (diffMonths < 12) {
    return `${diffMonths} เดือนที่แล้ว`;
  } else {
    return `${diffYears} ปีที่แล้ว`;
  }
}
