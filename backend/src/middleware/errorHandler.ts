import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { AppError, createErrorResponse, shouldLogError } from '../utils/errors';
import { logger } from '../utils/logger';
import { config } from '../config';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let appError: AppError;

  // Handle different types of errors
  if (error instanceof AppError) {
    appError = error;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    appError = handlePrismaError(error);
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    appError = new AppError('Invalid data provided', 400, 'VALIDATION_ERROR');
  } else if (error.name === 'ValidationError') {
    appError = new AppError(error.message, 400, 'VALIDATION_ERROR');
  } else if (error.name === 'CastError') {
    appError = new AppError('Invalid ID format', 400, 'INVALID_ID');
  } else if (error.name === 'MulterError') {
    appError = handleMulterError(error as any);
  } else {
    // Unknown error
    appError = new AppError(
      config.nodeEnv === 'production' ? 'Internal server error' : error.message,
      500,
      'INTERNAL_ERROR',
      false
    );
  }

  // Log error if necessary
  if (shouldLogError(appError)) {
    logger.error('Application error', {
      error: {
        message: appError.message,
        code: appError.code,
        statusCode: appError.statusCode,
        stack: appError.stack,
      },
      request: {
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        body: sanitizeRequestBody(req.body),
        headers: {
          'user-agent': req.get('User-Agent'),
          'x-forwarded-for': req.get('X-Forwarded-For'),
        },
        ip: req.ip,
      },
      user: (req as any).user ? {
        id: (req as any).user.id,
        email: (req as any).user.email,
        role: (req as any).user.role,
      } : null,
    });
  }

  // Send error response
  const includeStack = config.nodeEnv === 'development';
  const errorResponse = createErrorResponse(appError, includeStack);

  res.status(appError.statusCode).json(errorResponse);
};

// Handle Prisma database errors
const handlePrismaError = (error: Prisma.PrismaClientKnownRequestError): AppError => {
  switch (error.code) {
    case 'P2002':
      // Unique constraint violation
      const field = error.meta?.target as string[] | undefined;
      const fieldName = field?.[0] || 'field';
      return new AppError(
        `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} already exists`,
        409,
        'DUPLICATE_ENTRY'
      );
    
    case 'P2025':
      // Record not found
      return new AppError('Record not found', 404, 'NOT_FOUND');
    
    case 'P2003':
      // Foreign key constraint violation
      return new AppError('Referenced record does not exist', 400, 'INVALID_REFERENCE');
    
    case 'P2014':
      // Required relation missing
      return new AppError('Required relation is missing', 400, 'MISSING_RELATION');
    
    case 'P2023':
      // Inconsistent column data
      return new AppError('Inconsistent data provided', 400, 'INCONSISTENT_DATA');
    
    default:
      logger.error('Unhandled Prisma error', { 
        code: error.code, 
        message: error.message,
        meta: error.meta 
      });
      return new AppError('Database operation failed', 500, 'DATABASE_ERROR');
  }
};

// Handle Multer file upload errors
const handleMulterError = (error: any): AppError => {
  switch (error.code) {
    case 'LIMIT_FILE_SIZE':
      return new AppError('File too large', 400, 'FILE_TOO_LARGE');
    
    case 'LIMIT_FILE_COUNT':
      return new AppError('Too many files', 400, 'TOO_MANY_FILES');
    
    case 'LIMIT_UNEXPECTED_FILE':
      return new AppError('Unexpected file field', 400, 'UNEXPECTED_FILE');
    
    case 'LIMIT_FIELD_KEY':
      return new AppError('Field name too long', 400, 'FIELD_NAME_TOO_LONG');
    
    case 'LIMIT_FIELD_VALUE':
      return new AppError('Field value too long', 400, 'FIELD_VALUE_TOO_LONG');
    
    case 'LIMIT_FIELD_COUNT':
      return new AppError('Too many fields', 400, 'TOO_MANY_FIELDS');
    
    case 'LIMIT_PART_COUNT':
      return new AppError('Too many parts', 400, 'TOO_MANY_PARTS');
    
    default:
      return new AppError('File upload failed', 500, 'UPLOAD_FAILED');
  }
};

// Sanitize request body for logging (remove sensitive data)
const sanitizeRequestBody = (body: any): any => {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const sensitiveFields = [
    'password',
    'confirmPassword',
    'currentPassword',
    'newPassword',
    'token',
    'refreshToken',
    'accessToken',
    'creditCard',
    'cardNumber',
    'cvv',
    'pin',
    'otp',
    'secretKey',
    'privateKey',
  ];

  const sanitized = { ...body };

  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  }

  return sanitized;
};

// Handle 404 errors for unknown routes
export const notFoundHandler = (req: Request, res: Response): void => {
  const error = new AppError(
    `Route ${req.originalUrl} not found`,
    404,
    'ROUTE_NOT_FOUND'
  );

  logger.warn('Route not found', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });

  const errorResponse = createErrorResponse(error);
  res.status(404).json(errorResponse);
};

export default errorHandler;
