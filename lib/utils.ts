import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatToGermanDate = (isoString: string): string => {
  const date = new Date(isoString)

  // Ensure the date is valid
  if (isNaN(date.getTime())) {
    return isoString
  }

  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0') // Months are zero-indexed
  const year = date.getUTCFullYear()

  return `${day}.${month}.${year}`
}

export function calculateAge(birthday: Date): number {
  const today = new Date()
  let age = today.getFullYear() - birthday.getFullYear()
  const monthDifference = today.getMonth() - birthday.getMonth()

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthday.getDate())
  ) {
    age--
  }

  return age
}

// src/utils/dateUtils.ts

/**
 * Converts a Date object to a YYYY-MM-DD string.
 * Returns undefined if the input is null or undefined.
 */
export function dateToString(
  date: Date | null | undefined,
): string | undefined {
  if (!date) return undefined
  return date.toISOString().split('T')[0]
}

/**
 * Converts a YYYY-MM-DD string to a Date object.
 * Returns undefined if the input is null, undefined, or an invalid date string.
 */
export function stringToDate(
  dateString: string | null | undefined,
): Date | undefined {
  if (!dateString) return undefined
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? undefined : date
}

/**
 * Safely converts any date input (Date object or string) to a YYYY-MM-DD string.
 * Returns undefined for null, undefined, or invalid inputs.
 */
export function toDateString(
  date: Date | string | null | undefined,
): string | undefined {
  if (!date) return undefined
  if (typeof date === 'string') {
    const parsedDate = stringToDate(date)
    return parsedDate ? dateToString(parsedDate) : undefined
  }
  return dateToString(date)
}

/**
 * Safely converts any date input (Date object or string) to a Date object.
 * Returns undefined for null, undefined, or invalid inputs.
 */
export function toDate(
  date: Date | string | null | undefined,
): Date | undefined {
  if (!date) return undefined
  if (typeof date === 'string') return stringToDate(date)
  return isNaN(date.getTime()) ? undefined : date
}
