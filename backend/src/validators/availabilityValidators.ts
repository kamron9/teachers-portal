import Joi from "joi";

export const availabilityRuleSchema = Joi.object({
  type: Joi.string().valid("recurring", "one_off").required().messages({
    "any.only": 'Type must be either "recurring" or "one_off"',
    "any.required": "Type is required",
  }),

  weekday: Joi.number()
    .integer()
    .min(0)
    .max(6)
    .when("type", {
      is: "recurring",
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    })
    .messages({
      "number.min": "Weekday must be between 0 (Sunday) and 6 (Saturday)",
      "number.max": "Weekday must be between 0 (Sunday) and 6 (Saturday)",
      "any.required": "Weekday is required for recurring availability",
      "any.unknown": "Weekday is not allowed for one-off availability",
    }),

  date: Joi.date()
    .iso()
    .when("type", {
      is: "one_off",
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    })
    .messages({
      "date.format": "Date must be in ISO format (YYYY-MM-DD)",
      "any.required": "Date is required for one-off availability",
      "any.unknown": "Date is not allowed for recurring availability",
    }),

  startTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      "string.pattern.base": "Start time must be in HH:MM format (24-hour)",
      "any.required": "Start time is required",
    }),

  endTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .custom((value, helpers) => {
      const startTime = helpers.state.ancestors[0].startTime;
      if (startTime && value <= startTime) {
        return helpers.error("endTime.invalid");
      }
      return value;
    })
    .messages({
      "string.pattern.base": "End time must be in HH:MM format (24-hour)",
      "any.required": "End time is required",
      "endTime.invalid": "End time must be after start time",
    }),

  isOpen: Joi.boolean().default(true).messages({
    "boolean.base": "isOpen must be a boolean value",
  }),
});

export const updateAvailabilitySchema = Joi.object({
  weekday: Joi.number().integer().min(0).max(6).optional().messages({
    "number.min": "Weekday must be between 0 (Sunday) and 6 (Saturday)",
    "number.max": "Weekday must be between 0 (Sunday) and 6 (Saturday)",
  }),

  date: Joi.date().iso().optional().messages({
    "date.format": "Date must be in ISO format (YYYY-MM-DD)",
  }),

  startTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .optional()
    .messages({
      "string.pattern.base": "Start time must be in HH:MM format (24-hour)",
    }),

  endTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .optional()
    .custom((value, helpers) => {
      const startTime = helpers.state.ancestors[0].startTime;
      if (startTime && value <= startTime) {
        return helpers.error("endTime.invalid");
      }
      return value;
    })
    .messages({
      "string.pattern.base": "End time must be in HH:MM format (24-hour)",
      "endTime.invalid": "End time must be after start time",
    }),

  isOpen: Joi.boolean().optional().messages({
    "boolean.base": "isOpen must be a boolean value",
  }),
});

export const getAvailabilitySchema = Joi.object({
  startDate: Joi.date().iso().optional().messages({
    "date.format": "Start date must be in ISO format (YYYY-MM-DD)",
  }),

  endDate: Joi.date().iso().min(Joi.ref("startDate")).optional().messages({
    "date.format": "End date must be in ISO format (YYYY-MM-DD)",
    "date.min": "End date must be after start date",
  }),

  timezone: Joi.string().default("Asia/Tashkent").messages({
    "string.base": "Timezone must be a valid timezone string",
  }),
});

export const bulkAvailabilitySchema = Joi.object({
  rules: Joi.array()
    .items(availabilityRuleSchema.fork(["type"], (schema) => schema.optional()))
    .min(1)
    .max(50)
    .required()
    .messages({
      "array.min": "At least one availability rule is required",
      "array.max": "Maximum 50 availability rules allowed in bulk operation",
      "any.required": "Rules array is required",
    }),

  replaceExisting: Joi.boolean().default(false).messages({
    "boolean.base": "Replace existing must be a boolean value",
  }),
});

export const timeSlotRequestSchema = Joi.object({
  teacherId: Joi.string().uuid().required().messages({
    "string.uuid": "Teacher ID must be a valid UUID",
    "any.required": "Teacher ID is required",
  }),

  startDate: Joi.date().iso().min("now").required().messages({
    "date.format": "Start date must be in ISO format (YYYY-MM-DD)",
    "date.min": "Start date cannot be in the past",
    "any.required": "Start date is required",
  }),

  endDate: Joi.date()
    .iso()
    .min(Joi.ref("startDate"))
    .max(
      Joi.ref("startDate", {
        adjust: (value) => new Date(value.getTime() + 30 * 24 * 60 * 60 * 1000),
      }),
    )
    .required()
    .messages({
      "date.format": "End date must be in ISO format (YYYY-MM-DD)",
      "date.min": "End date must be after start date",
      "date.max": "End date cannot be more than 30 days from start date",
      "any.required": "End date is required",
    }),

  timezone: Joi.string().default("Asia/Tashkent").messages({
    "string.base": "Timezone must be a valid timezone string",
  }),

  duration: Joi.number().valid(30, 60, 90, 120).default(60).messages({
    "any.only": "Duration must be one of: 30, 60, 90, or 120 minutes",
  }),

  subjectOfferingId: Joi.string().uuid().optional().messages({
    "string.uuid": "Subject offering ID must be a valid UUID",
  }),
});

export const scheduleTemplateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    "string.min": "Template name must be at least 2 characters long",
    "string.max": "Template name cannot exceed 50 characters",
    "any.required": "Template name is required",
  }),

  description: Joi.string().trim().max(200).optional().messages({
    "string.max": "Description cannot exceed 200 characters",
  }),

  rules: Joi.array()
    .items(availabilityRuleSchema.fork(["type"], (schema) => schema.optional()))
    .min(1)
    .max(20)
    .required()
    .messages({
      "array.min": "At least one availability rule is required",
      "array.max": "Maximum 20 availability rules allowed per template",
      "any.required": "Rules array is required",
    }),

  isDefault: Joi.boolean().default(false).messages({
    "boolean.base": "Is default must be a boolean value",
  }),
});

export const breakTimeSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    "string.min": "Break name must be at least 2 characters long",
    "string.max": "Break name cannot exceed 50 characters",
    "any.required": "Break name is required",
  }),

  startTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      "string.pattern.base": "Start time must be in HH:MM format (24-hour)",
      "any.required": "Start time is required",
    }),

  endTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .custom((value, helpers) => {
      const startTime = helpers.state.ancestors[0].startTime;
      if (startTime && value <= startTime) {
        return helpers.error("endTime.invalid");
      }
      return value;
    })
    .messages({
      "string.pattern.base": "End time must be in HH:MM format (24-hour)",
      "any.required": "End time is required",
      "endTime.invalid": "End time must be after start time",
    }),

  recurring: Joi.boolean().default(true).messages({
    "boolean.base": "Recurring must be a boolean value",
  }),

  weekdays: Joi.array()
    .items(Joi.number().integer().min(0).max(6))
    .unique()
    .when("recurring", {
      is: true,
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    })
    .messages({
      "array.unique": "Weekdays must be unique",
      "any.required": "Weekdays are required for recurring breaks",
      "any.unknown": "Weekdays are not allowed for non-recurring breaks",
    }),
});

export default {
  availabilityRuleSchema,
  updateAvailabilitySchema,
  getAvailabilitySchema,
  bulkAvailabilitySchema,
  timeSlotRequestSchema,
  scheduleTemplateSchema,
  breakTimeSchema,
};
