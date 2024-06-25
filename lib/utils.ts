import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatToGermanDate = (isoString: string): string => {
  const date = new Date(isoString);

  // Ensure the date is valid
  if (isNaN(date.getTime())) {
    return isoString;
  }

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = date.getUTCFullYear();

  return `${day}.${month}.${year}`;
};
