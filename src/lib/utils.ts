import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Retiree, Startup } from '@/api/openapi-client/models';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string | Date | null) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year.toString()}`;
}

// Validation functions for profile completion
export function isRetireeProfileComplete(retiree: Retiree): boolean {
  // Only check first name and last name for retirees
  return Boolean(
    retiree.nameFirst &&
      retiree.nameFirst.trim() !== '' &&
      retiree.nameLast &&
      retiree.nameLast.trim() !== '',
  );
}

export function isStartupProfileComplete(startup: Startup): boolean {
  return Boolean(startup.title && startup.title.trim() !== '');
}

// generates pseudo-random number based on a seed string between 0 and 1
export function pseudoRandomNumBySeed(seed: string) {
  const seedNumber = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const x = Math.sin(seedNumber) * 10000;
  return x - Math.floor(x);
}
