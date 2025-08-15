export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly timestamp: string;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    isOperational: boolean = true
  ) {
    super(message);
    
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  public readonly fields: Record<string, string>;

  constructor(message: string, fields: Record<string, string> = {}) {
    super(message, 400, 'VALIDATION_ERROR');
    this.fields = fields;
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409, 'CONFLICT');
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
  }
}

export class PaymentError extends AppError {
  constructor(message: string, code: string = 'PAYMENT_ERROR') {
    super(message, 402, code);
  }
}

export class BookingError extends AppError {
  constructor(message: string, code: string = 'BOOKING_ERROR') {
    super(message, 400, code);
  }
}

// Error codes for specific business logic errors
export const ErrorCodes = {
  // Authentication & Authorization
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  PHONE_NOT_VERIFIED: 'PHONE_NOT_VERIFIED',
  
  // User Management
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  INVALID_USER_ROLE: 'INVALID_USER_ROLE',
  
  // Teacher Verification
  TEACHER_NOT_VERIFIED: 'TEACHER_NOT_VERIFIED',
  VERIFICATION_PENDING: 'VERIFICATION_PENDING',
  VERIFICATION_REJECTED: 'VERIFICATION_REJECTED',
  
  // Booking Errors
  SLOT_NOT_AVAILABLE: 'SLOT_NOT_AVAILABLE',
  BOOKING_CANCELLED: 'BOOKING_CANCELLED',
  BOOKING_EXPIRED: 'BOOKING_EXPIRED',
  INSUFFICIENT_NOTICE: 'INSUFFICIENT_NOTICE',
  DOUBLE_BOOKING: 'DOUBLE_BOOKING',
  
  // Payment Errors
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  PAYMENT_DECLINED: 'PAYMENT_DECLINED',
  REFUND_FAILED: 'REFUND_FAILED',
  PAYOUT_FAILED: 'PAYOUT_FAILED',
  
  // Subject & Pricing
  SUBJECT_LIMIT_EXCEEDED: 'SUBJECT_LIMIT_EXCEEDED',
  INVALID_PRICE_RANGE: 'INVALID_PRICE_RANGE',
  SUBJECT_NOT_FOUND: 'SUBJECT_NOT_FOUND',
  
  // Availability
  INVALID_TIME_SLOT: 'INVALID_TIME_SLOT',
  SCHEDULE_CONFLICT: 'SCHEDULE_CONFLICT',
  PAST_DATE_BOOKING: 'PAST_DATE_BOOKING',
  
  // Reviews & Ratings
  REVIEW_ALREADY_EXISTS: 'REVIEW_ALREADY_EXISTS',
  REVIEW_NOT_ALLOWED: 'REVIEW_NOT_ALLOWED',
  INVALID_RATING: 'INVALID_RATING',
  
  // Messaging
  MESSAGE_TOO_LONG: 'MESSAGE_TOO_LONG',
  THREAD_NOT_FOUND: 'THREAD_NOT_FOUND',
  MESSAGE_BLOCKED: 'MESSAGE_BLOCKED',
  
  // File Upload
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
  
  // Admin & Moderation
  ADMIN_ONLY: 'ADMIN_ONLY',
  MODERATION_REQUIRED: 'MODERATION_REQUIRED',
  CONTENT_FLAGGED: 'CONTENT_FLAGGED',
  
  // System Errors
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  CONFIGURATION_ERROR: 'CONFIGURATION_ERROR',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

// Helper function to create standardized error responses
export const createErrorResponse = (
  error: AppError,
  includeStack: boolean = false
) => {
  const response: any = {
    error: error.code,
    message: error.message,
    timestamp: error.timestamp,
  };

  // Include validation fields if available
  if (error instanceof ValidationError && Object.keys(error.fields).length > 0) {
    response.fields = error.fields;
  }

  // Include stack trace in development
  if (includeStack && error.stack) {
    response.stack = error.stack;
  }

  return response;
};

// Helper function to determine if error should be logged
export const shouldLogError = (error: AppError): boolean => {
  // Don't log validation errors and user errors (4xx)
  if (error.statusCode >= 400 && error.statusCode < 500) {
    return false;
  }
  
  // Log all server errors (5xx) and operational errors
  return error.statusCode >= 500 || !error.isOperational;
};

export default AppError;
