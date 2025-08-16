import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { ValidationError } from "../utils/errors";

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const fields: Record<string, string> = {};

      error.details.forEach((detail) => {
        const field = detail.path.join(".");
        fields[field] = detail.message;
      });

      throw new ValidationError("Validation failed", fields);
    }

    // Replace request body with validated and sanitized data
    req.body = value;
    next();
  };
};

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const fields: Record<string, string> = {};

      error.details.forEach((detail) => {
        const field = detail.path.join(".");
        fields[field] = detail.message;
      });

      throw new ValidationError("Query validation failed", fields);
    }

    req.query = value;
    next();
  };
};

export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const fields: Record<string, string> = {};

      error.details.forEach((detail) => {
        const field = detail.path.join(".");
        fields[field] = detail.message;
      });

      throw new ValidationError("Parameter validation failed", fields);
    }

    req.params = value;
    next();
  };
};

// Common validation schemas
export const commonSchemas = {
  id: Joi.string().uuid().required(),
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sort: Joi.string().optional(),
    order: Joi.string().valid("asc", "desc").default("desc"),
  }),
  dateRange: Joi.object({
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().min(Joi.ref("startDate")).optional(),
  }),
};

export const validationMiddleware = {
  validateRequest,
  validateQuery,
  validateParams,
  commonSchemas,
};

export default validateRequest;
