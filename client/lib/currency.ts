/**
 * Currency utilities for UZS (Uzbek Som) formatting and conversion
 * All amounts are stored as integers (kopeks) in the backend
 */

export const CURRENCY_CONFIG = {
  currency: 'UZS',
  locale: 'uz-UZ',
  kopeksPerSom: 100, // 1 UZS = 100 kopeks
  defaultCurrency: 'UZS',
  timezone: 'Asia/Tashkent',
} as const;

/**
 * Format amount from kopeks to UZS with proper spacing
 * @param kopeks - Amount in kopeks (integer)
 * @param options - Formatting options
 * @returns Formatted string like "50 000 UZS"
 */
export function formatUZS(
  kopeks: number,
  options: {
    showCurrency?: boolean;
    showDecimals?: boolean;
    compact?: boolean;
  } = {}
): string {
  const {
    showCurrency = true,
    showDecimals = false,
    compact = false,
  } = options;

  // Convert kopeks to UZS
  const amount = kopeks / CURRENCY_CONFIG.kopeksPerSom;

  let formattedAmount: string;

  if (compact && amount >= 1000000) {
    // Format large amounts like "1.2M UZS"
    formattedAmount = (amount / 1000000).toFixed(1) + 'M';
  } else if (compact && amount >= 1000) {
    // Format thousands like "50K UZS"
    formattedAmount = (amount / 1000).toFixed(1) + 'K';
  } else {
    // Regular formatting with spaced thousands
    const decimals = showDecimals ? 2 : 0;
    formattedAmount = new Intl.NumberFormat('uz-UZ', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
    
    // Replace commas with spaces for UZS formatting convention
    formattedAmount = formattedAmount.replace(/,/g, ' ');
  }

  return showCurrency ? `${formattedAmount} UZS` : formattedAmount;
}

/**
 * Parse UZS string to kopeks
 * @param uzsString - String like "50 000" or "50,000"
 * @returns Amount in kopeks
 */
export function parseUZS(uzsString: string): number {
  // Remove all non-digit characters except decimal point
  const cleanString = uzsString.replace(/[^\d.]/g, '');
  const amount = parseFloat(cleanString) || 0;
  
  // Convert to kopeks
  return Math.round(amount * CURRENCY_CONFIG.kopeksPerSom);
}

/**
 * Validate UZS amount
 * @param kopeks - Amount in kopeks
 * @param min - Minimum amount in kopeks
 * @param max - Maximum amount in kopeks
 * @returns Validation result
 */
export function validateUZSAmount(
  kopeks: number,
  min: number = 0,
  max: number = Number.MAX_SAFE_INTEGER
): { isValid: boolean; error?: string } {
  if (kopeks < min) {
    return {
      isValid: false,
      error: `Minimal miqdor ${formatUZS(min)}`,
    };
  }

  if (kopeks > max) {
    return {
      isValid: false,
      error: `Maksimal miqdor ${formatUZS(max)}`,
    };
  }

  return { isValid: true };
}

/**
 * Calculate percentage of amount
 * @param kopeks - Base amount in kopeks
 * @param percentage - Percentage (e.g., 15 for 15%)
 * @returns Calculated amount in kopeks
 */
export function calculatePercentage(kopeks: number, percentage: number): number {
  return Math.round((kopeks * percentage) / 100);
}

/**
 * Format price per hour for teachers
 * @param pricePerHour - Price in kopeks per hour
 * @returns Formatted string like "50 000 UZS/soat"
 */
export function formatPricePerHour(pricePerHour: number): string {
  return `${formatUZS(pricePerHour)}/soat`;
}

/**
 * Calculate lesson total with any discounts
 * @param pricePerHour - Base price in kopeks
 * @param duration - Duration in minutes
 * @param discountPercentage - Discount percentage (optional)
 * @returns Total amount in kopeks
 */
export function calculateLessonTotal(
  pricePerHour: number,
  duration: number,
  discountPercentage: number = 0
): number {
  const hourlyTotal = (pricePerHour * duration) / 60;
  const discount = calculatePercentage(hourlyTotal, discountPercentage);
  return Math.round(hourlyTotal - discount);
}

/**
 * Price range formatter for filters
 * @param minKopeks - Minimum price in kopeks
 * @param maxKopeks - Maximum price in kopeks
 * @returns Formatted range like "10 000 - 100 000 UZS"
 */
export function formatPriceRange(minKopeks: number, maxKopeks: number): string {
  return `${formatUZS(minKopeks, { showCurrency: false })} - ${formatUZS(maxKopeks)}`;
}

/**
 * Common price constants (in kopeks)
 */
export const PRICE_CONSTANTS = {
  MIN_LESSON_PRICE: 1000000, // 10,000 UZS
  MAX_LESSON_PRICE: 50000000, // 500,000 UZS
  MIN_TRIAL_PRICE: 500000, // 5,000 UZS
  DEFAULT_TRIAL_DISCOUNT: 50, // 50% off
  PLATFORM_COMMISSION: 15, // 15%
  MIN_PAYOUT_AMOUNT: 5000000, // 50,000 UZS
} as const;
