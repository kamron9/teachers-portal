// Security utilities for TutorUZ

// Environment variables validation
export function validateEnvVars() {
  const requiredVars = ["VITE_API_BASE_URL"];
  const missing = requiredVars.filter((v) => !import.meta.env[v]);

  if (missing.length > 0 && import.meta.env.DEV) {
    console.error("Missing required environment variables:", missing);
  }
}

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>'"]/g, "") // Remove potential XSS characters
    .trim()
    .substring(0, 1000); // Limit length
}

// Email validation with additional security
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Phone validation for Uzbekistan
export function isValidUzbekPhone(phone: string): boolean {
  const phoneRegex = /^\+998[0-9]{9}$/;
  return phoneRegex.test(phone);
}

// Password strength checker
export function checkPasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score += 1;
  else feedback.push("Kamida 8 ta belgi");

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push("Katta harf");

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push("Kichik harf");

  if (/[0-9]/.test(password)) score += 1;
  else feedback.push("Raqam");

  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  else feedback.push("Maxsus belgi");

  return { score, feedback };
}

// Rate limiting check (client-side basic)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  key: string,
  maxRequests = 10,
  windowMs = 60000,
): boolean {
  const now = Date.now();
  const record = requestCounts.get(key);

  if (!record || now > record.resetTime) {
    requestCounts.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

// XSS protection
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// File upload validation
export function validateFileUpload(file: File): {
  valid: boolean;
  error?: string;
} {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
  ];

  if (file.size > maxSize) {
    return { valid: false, error: "Fayl hajmi 10MB dan oshmasligi kerak" };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Faqat JPG, PNG, WebP va PDF fayllar ruxsat etilgan",
    };
  }

  return { valid: true };
}

// URL validation
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Initialize security measures
export function initializeSecurity(): void {
  validateEnvVars();

  // Remove sensitive data from console in production
  if (import.meta.env.PROD) {
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
  }
}
