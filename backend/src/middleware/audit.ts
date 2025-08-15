import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { logger } from '../utils/logger';
import { AuthRequest } from './auth';

interface AuditLogData {
  action: string;
  resource: string;
  resourceId?: string;
  oldValues?: any;
  newValues?: any;
}

// Middleware to log audit events
export const auditMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // Store original methods
  const originalSend = res.send;
  const originalJson = res.json;

  // Track request data
  const requestData = {
    method: req.method,
    path: req.path,
    body: sanitizeBody(req.body),
    query: req.query,
    params: req.params,
  };

  // Override response methods to capture response data
  res.send = function(data: any) {
    res.locals.responseData = data;
    return originalSend.call(this, data);
  };

  res.json = function(data: any) {
    res.locals.responseData = data;
    return originalJson.call(this, data);
  };

  // Log audit event after response is sent
  res.on('finish', async () => {
    // Only log successful write operations for authenticated users
    if (
      req.user && 
      res.statusCode < 400 && 
      ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)
    ) {
      try {
        const auditData = extractAuditData(req, res);
        if (auditData) {
          await createAuditLog(req, auditData);
        }
      } catch (error) {
        logger.error('Failed to create audit log', {
          error: error.message,
          userId: req.user.id,
          path: req.path,
        });
      }
    }
  });

  next();
};

// Extract audit data from request and response
const extractAuditData = (req: AuthRequest, res: Response): AuditLogData | null => {
  const { method, path } = req;
  const responseData = res.locals.responseData;

  // Map routes to resources and actions
  const pathSegments = path.split('/').filter(Boolean);
  const resource = pathSegments[2] || 'unknown'; // Skip 'api' and 'v1'
  const resourceId = pathSegments[3] || extractResourceIdFromResponse(responseData);

  let action: string;
  switch (method) {
    case 'POST':
      action = 'CREATE';
      break;
    case 'PUT':
    case 'PATCH':
      action = 'UPDATE';
      break;
    case 'DELETE':
      action = 'DELETE';
      break;
    default:
      return null; // Don't audit GET requests
  }

  return {
    action,
    resource,
    resourceId,
    oldValues: method === 'PUT' || method === 'PATCH' ? req.body.oldValues : undefined,
    newValues: method === 'POST' || method === 'PUT' || method === 'PATCH' ? 
      sanitizeBody(req.body) : undefined,
  };
};

// Create audit log entry
const createAuditLog = async (req: AuthRequest, auditData: AuditLogData): Promise<void> => {
  try {
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: auditData.action,
        resource: auditData.resource,
        resourceId: auditData.resourceId,
        oldValues: auditData.oldValues || null,
        newValues: auditData.newValues || null,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || null,
      },
    });

    logger.info('Audit log created', {
      userId: req.user!.id,
      action: auditData.action,
      resource: auditData.resource,
      resourceId: auditData.resourceId,
    });
  } catch (error) {
    logger.error('Failed to create audit log entry', {
      error: error.message,
      auditData,
      userId: req.user!.id,
    });
    // Don't throw error to avoid affecting the main request
  }
};

// Extract resource ID from response data
const extractResourceIdFromResponse = (responseData: any): string | undefined => {
  if (!responseData) return undefined;
  
  try {
    const parsed = typeof responseData === 'string' ? JSON.parse(responseData) : responseData;
    return parsed.id || parsed.data?.id;
  } catch {
    return undefined;
  }
};

// Sanitize request body (remove sensitive data)
const sanitizeBody = (body: any): any => {
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
    'bankAccount',
    'routingNumber',
  ];

  const sanitized = JSON.parse(JSON.stringify(body));

  const sanitizeRecursive = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(sanitizeRecursive);
    }
    
    if (obj && typeof obj === 'object') {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (sensitiveFields.includes(key.toLowerCase())) {
          result[key] = '[REDACTED]';
        } else {
          result[key] = sanitizeRecursive(value);
        }
      }
      return result;
    }
    
    return obj;
  };

  return sanitizeRecursive(sanitized);
};

// Manual audit logging for complex operations
export const logAuditEvent = async (
  userId: string,
  action: string,
  resource: string,
  resourceId?: string,
  oldValues?: any,
  newValues?: any,
  metadata?: any
): Promise<void> => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        oldValues: oldValues || null,
        newValues: newValues || null,
        ipAddress: metadata?.ipAddress || null,
        userAgent: metadata?.userAgent || null,
      },
    });

    logger.info('Manual audit log created', {
      userId,
      action,
      resource,
      resourceId,
    });
  } catch (error) {
    logger.error('Failed to create manual audit log', {
      error: error.message,
      userId,
      action,
      resource,
      resourceId,
    });
  }
};

export default auditMiddleware;
