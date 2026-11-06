/**
 * Utilities for formatting dates, numbers, strings, and language codes.
 */

export function formatDate(date: Date | string | number, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  }).format(d);
}

export function formatTimeAgo(timestamp: string | number | Date): string {
  const now = Date.now();
  const past = new Date(timestamp).getTime();
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  return formatDate(timestamp);
}

export function formatPercentage(value: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((value / total) * 100)));
}

export function formatNumberCompact(num: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(num);
}

export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
