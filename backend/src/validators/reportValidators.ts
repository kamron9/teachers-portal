import Joi from "joi";

// Revenue report validation schema
export const revenueReportSchema = Joi.object({
  startDate: Joi.date().iso().required().messages({
    "date.format": "Start date must be in ISO format",
    "any.required": "Start date is required",
  }),

  endDate: Joi.date().iso().min(Joi.ref("startDate")).required().messages({
    "date.format": "End date must be in ISO format",
    "date.min": "End date must be after start date",
    "any.required": "End date is required",
  }),

  groupBy: Joi.string()
    .valid("hour", "day", "week", "month")
    .default("day")
    .messages({
      "any.only": "Group by must be one of: hour, day, week, month",
    }),

  includeRefunds: Joi.boolean().default(true).messages({
    "boolean.base": "Include refunds must be a boolean value",
  }),

  currency: Joi.string()
    .valid("USD", "UZS", "EUR", "GBP")
    .default("UZS")
    .messages({
      "any.only": "Currency must be one of: USD, UZS, EUR, GBP",
    }),

  teacherId: Joi.string().uuid({ version: "uuidv4" }).optional().messages({
    "string.uuid": "Teacher ID must be a valid UUID",
  }),

  studentId: Joi.string().uuid({ version: "uuidv4" }).optional().messages({
    "string.uuid": "Student ID must be a valid UUID",
  }),

  subjectFilter: Joi.string().trim().min(1).max(100).optional().messages({
    "string.min": "Subject filter must be at least 1 character",
    "string.max": "Subject filter must not exceed 100 characters",
  }),

  paymentMethod: Joi.string()
    .valid("CARD", "BANK_TRANSFER", "CLICK", "PAYME", "UZCARD")
    .optional()
    .messages({
      "any.only":
        "Payment method must be one of: CARD, BANK_TRANSFER, CLICK, PAYME, UZCARD",
    }),

  minAmount: Joi.number().min(0).optional().messages({
    "number.min": "Minimum amount must be at least 0",
  }),

  maxAmount: Joi.number()
    .min(0)
    .optional()
    .when("minAmount", {
      is: Joi.exist(),
      then: Joi.number().min(Joi.ref("minAmount")),
    })
    .messages({
      "number.min": "Maximum amount must be at least 0",
      "number.ref":
        "Maximum amount must be greater than or equal to minimum amount",
    }),
});

// User analytics validation schema
export const userAnalyticsSchema = Joi.object({
  startDate: Joi.date().iso().required().messages({
    "date.format": "Start date must be in ISO format",
    "any.required": "Start date is required",
  }),

  endDate: Joi.date().iso().min(Joi.ref("startDate")).required().messages({
    "date.format": "End date must be in ISO format",
    "date.min": "End date must be after start date",
    "any.required": "End date is required",
  }),

  groupBy: Joi.string()
    .valid("hour", "day", "week", "month")
    .default("day")
    .messages({
      "any.only": "Group by must be one of: hour, day, week, month",
    }),

  includeInactive: Joi.boolean().default(false).messages({
    "boolean.base": "Include inactive must be a boolean value",
  }),

  userType: Joi.string()
    .valid("all", "STUDENT", "TEACHER", "ADMIN")
    .default("all")
    .messages({
      "any.only": "User type must be one of: all, STUDENT, TEACHER, ADMIN",
    }),

  region: Joi.string().trim().min(1).max(100).optional().messages({
    "string.min": "Region must be at least 1 character",
    "string.max": "Region must not exceed 100 characters",
  }),

  ageRange: Joi.object({
    min: Joi.number().integer().min(13).max(100).optional(),
    max: Joi.number().integer().min(13).max(100).optional(),
  })
    .optional()
    .messages({
      "number.integer": "Age must be an integer",
      "number.min": "Age must be at least 13",
      "number.max": "Age must not exceed 100",
    }),

  registrationSource: Joi.string()
    .valid("WEB", "MOBILE", "REFERRAL", "SOCIAL", "DIRECT")
    .optional()
    .messages({
      "any.only":
        "Registration source must be one of: WEB, MOBILE, REFERRAL, SOCIAL, DIRECT",
    }),

  includeLoginActivity: Joi.boolean().default(true).messages({
    "boolean.base": "Include login activity must be a boolean value",
  }),

  includeEngagementMetrics: Joi.boolean().default(true).messages({
    "boolean.base": "Include engagement metrics must be a boolean value",
  }),
});

// Teacher performance validation schema
export const teacherPerformanceSchema = Joi.object({
  startDate: Joi.date().iso().required().messages({
    "date.format": "Start date must be in ISO format",
    "any.required": "Start date is required",
  }),

  endDate: Joi.date().iso().min(Joi.ref("startDate")).required().messages({
    "date.format": "End date must be in ISO format",
    "date.min": "End date must be after start date",
    "any.required": "End date is required",
  }),

  includeUnverified: Joi.boolean().default(false).messages({
    "boolean.base": "Include unverified must be a boolean value",
  }),

  minBookings: Joi.number().integer().min(0).max(1000).default(0).messages({
    "number.integer": "Minimum bookings must be an integer",
    "number.min": "Minimum bookings must be at least 0",
    "number.max": "Minimum bookings must not exceed 1000",
  }),

  minRating: Joi.number().min(1).max(5).optional().messages({
    "number.min": "Minimum rating must be at least 1",
    "number.max": "Minimum rating must not exceed 5",
  }),

  sortBy: Joi.string()
    .valid("rating", "earnings", "bookings", "completionRate", "responseTime")
    .default("rating")
    .messages({
      "any.only":
        "Sort by must be one of: rating, earnings, bookings, completionRate, responseTime",
    }),

  sortOrder: Joi.string().valid("asc", "desc").default("desc").messages({
    "any.only": "Sort order must be either asc or desc",
  }),

  subjects: Joi.array()
    .items(Joi.string().trim().min(1).max(100))
    .max(20)
    .optional()
    .messages({
      "array.max": "Maximum 20 subjects can be filtered",
      "string.min": "Subject name must be at least 1 character",
      "string.max": "Subject name must not exceed 100 characters",
    }),

  regions: Joi.array()
    .items(Joi.string().trim().min(1).max(100))
    .max(50)
    .optional()
    .messages({
      "array.max": "Maximum 50 regions can be filtered",
      "string.min": "Region name must be at least 1 character",
      "string.max": "Region name must not exceed 100 characters",
    }),

  experienceLevel: Joi.string()
    .valid("BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT")
    .optional()
    .messages({
      "any.only":
        "Experience level must be one of: BEGINNER, INTERMEDIATE, ADVANCED, EXPERT",
    }),

  limit: Joi.number().integer().min(1).max(1000).default(100).messages({
    "number.integer": "Limit must be an integer",
    "number.min": "Limit must be at least 1",
    "number.max": "Limit must not exceed 1000",
  }),
});

// Booking analytics validation schema
export const bookingAnalyticsSchema = Joi.object({
  startDate: Joi.date().iso().required().messages({
    "date.format": "Start date must be in ISO format",
    "any.required": "Start date is required",
  }),

  endDate: Joi.date().iso().min(Joi.ref("startDate")).required().messages({
    "date.format": "End date must be in ISO format",
    "date.min": "End date must be after start date",
    "any.required": "End date is required",
  }),

  groupBy: Joi.string()
    .valid("hour", "day", "week", "month")
    .default("day")
    .messages({
      "any.only": "Group by must be one of: hour, day, week, month",
    }),

  includeStatus: Joi.array()
    .items(
      Joi.string().valid(
        "PENDING",
        "CONFIRMED",
        "COMPLETED",
        "CANCELLED",
        "RESCHEDULED",
      ),
    )
    .min(1)
    .optional()
    .messages({
      "array.min": "At least one status must be provided",
      "any.only":
        "Status must be one of: PENDING, CONFIRMED, COMPLETED, CANCELLED, RESCHEDULED",
    }),

  subjectFilter: Joi.string().trim().min(1).max(100).optional().messages({
    "string.min": "Subject filter must be at least 1 character",
    "string.max": "Subject filter must not exceed 100 characters",
  }),

  teacherId: Joi.string().uuid({ version: "uuidv4" }).optional().messages({
    "string.uuid": "Teacher ID must be a valid UUID",
  }),

  studentId: Joi.string().uuid({ version: "uuidv4" }).optional().messages({
    "string.uuid": "Student ID must be a valid UUID",
  }),

  minDuration: Joi.number().integer().min(15).max(480).optional().messages({
    "number.integer": "Minimum duration must be an integer",
    "number.min": "Minimum duration must be at least 15 minutes",
    "number.max": "Minimum duration must not exceed 480 minutes",
  }),

  maxDuration: Joi.number()
    .integer()
    .min(15)
    .max(480)
    .optional()
    .when("minDuration", {
      is: Joi.exist(),
      then: Joi.number().min(Joi.ref("minDuration")),
    })
    .messages({
      "number.integer": "Maximum duration must be an integer",
      "number.min": "Maximum duration must be at least 15 minutes",
      "number.max": "Maximum duration must not exceed 480 minutes",
      "number.ref":
        "Maximum duration must be greater than or equal to minimum duration",
    }),

  includeRecurring: Joi.boolean().default(true).messages({
    "boolean.base": "Include recurring must be a boolean value",
  }),

  includeCancellationReasons: Joi.boolean().default(true).messages({
    "boolean.base": "Include cancellation reasons must be a boolean value",
  }),

  timeZone: Joi.string().optional().messages({
    "string.base": "Time zone must be a valid timezone string",
  }),
});

// Platform metrics validation schema
export const platformMetricsSchema = Joi.object({
  period: Joi.string()
    .valid("day", "week", "month", "quarter", "year")
    .default("week")
    .messages({
      "any.only": "Period must be one of: day, week, month, quarter, year",
    }),

  includeComparisons: Joi.boolean().default(true).messages({
    "boolean.base": "Include comparisons must be a boolean value",
  }),

  metrics: Joi.array()
    .items(
      Joi.string().valid(
        "users",
        "bookings",
        "revenue",
        "content",
        "engagement",
        "performance",
        "system",
      ),
    )
    .min(1)
    .default(["users", "bookings", "revenue"])
    .messages({
      "array.min": "At least one metric must be selected",
      "any.only":
        "Metrics must be one of: users, bookings, revenue, content, engagement, performance, system",
    }),

  breakdown: Joi.array()
    .items(Joi.string().valid("role", "region", "subject", "device", "source"))
    .max(5)
    .optional()
    .messages({
      "array.max": "Maximum 5 breakdown dimensions can be selected",
    }),

  includeForecasting: Joi.boolean().default(false).messages({
    "boolean.base": "Include forecasting must be a boolean value",
  }),

  forecastPeriods: Joi.number()
    .integer()
    .min(1)
    .max(12)
    .optional()
    .when("includeForecasting", {
      is: true,
      then: Joi.required(),
    })
    .messages({
      "number.integer": "Forecast periods must be an integer",
      "number.min": "Forecast periods must be at least 1",
      "number.max": "Forecast periods must not exceed 12",
      "any.required":
        "Forecast periods is required when forecasting is enabled",
    }),
});

// Custom report validation schema
export const customReportSchema = Joi.object({
  reportName: Joi.string().trim().min(3).max(100).required().messages({
    "string.min": "Report name must be at least 3 characters",
    "string.max": "Report name must not exceed 100 characters",
    "any.required": "Report name is required",
  }),

  description: Joi.string().trim().max(500).optional().allow("").messages({
    "string.max": "Description must not exceed 500 characters",
  }),

  dataSource: Joi.string()
    .valid(
      "users",
      "bookings",
      "payments",
      "reviews",
      "teachers",
      "students",
      "subjects",
    )
    .required()
    .messages({
      "any.only":
        "Data source must be one of: users, bookings, payments, reviews, teachers, students, subjects",
      "any.required": "Data source is required",
    }),

  metrics: Joi.array()
    .items(
      Joi.string().valid(
        "count",
        "sum",
        "avg",
        "min",
        "max",
        "growth",
        "rate",
        "percentage",
        "ratio",
        "trend",
      ),
    )
    .min(1)
    .max(10)
    .required()
    .messages({
      "array.min": "At least one metric must be selected",
      "array.max": "Maximum 10 metrics can be selected",
      "any.required": "Metrics are required",
    }),

  dimensions: Joi.array().items(Joi.string()).max(20).optional().messages({
    "array.max": "Maximum 20 dimensions can be selected",
  }),

  filters: Joi.object({
    dateRange: Joi.object({
      start: Joi.date().iso().required(),
      end: Joi.date().iso().min(Joi.ref("start")).required(),
    }).optional(),

    userTypes: Joi.array()
      .items(Joi.string().valid("STUDENT", "TEACHER", "ADMIN"))
      .optional(),

    statuses: Joi.array().items(Joi.string()).optional(),

    regions: Joi.array().items(Joi.string()).optional(),

    subjects: Joi.array().items(Joi.string()).optional(),

    customFilters: Joi.object()
      .pattern(
        Joi.string(),
        Joi.alternatives().try(
          Joi.string(),
          Joi.number(),
          Joi.boolean(),
          Joi.array().items(Joi.alternatives().try(Joi.string(), Joi.number())),
        ),
      )
      .max(20)
      .optional()
      .messages({
        "object.max": "Maximum 20 custom filters can be applied",
      }),
  }).optional(),

  groupBy: Joi.alternatives()
    .try(Joi.string(), Joi.array().items(Joi.string()).max(5))
    .optional()
    .messages({
      "array.max": "Maximum 5 group by fields can be specified",
    }),

  orderBy: Joi.array()
    .items(
      Joi.object({
        field: Joi.string().required(),
        direction: Joi.string().valid("asc", "desc").default("desc"),
      }),
    )
    .max(5)
    .optional()
    .messages({
      "array.max": "Maximum 5 order by fields can be specified",
    }),

  limit: Joi.number().integer().min(1).max(10000).default(1000).messages({
    "number.integer": "Limit must be an integer",
    "number.min": "Limit must be at least 1",
    "number.max": "Limit must not exceed 10000",
  }),

  startDate: Joi.date().iso().required().messages({
    "date.format": "Start date must be in ISO format",
    "any.required": "Start date is required",
  }),

  endDate: Joi.date().iso().min(Joi.ref("startDate")).required().messages({
    "date.format": "End date must be in ISO format",
    "date.min": "End date must be after start date",
    "any.required": "End date is required",
  }),

  format: Joi.string()
    .valid("json", "csv", "xlsx", "pdf")
    .default("json")
    .messages({
      "any.only": "Format must be one of: json, csv, xlsx, pdf",
    }),

  includeRawData: Joi.boolean().default(false).messages({
    "boolean.base": "Include raw data must be a boolean value",
  }),

  includeCharts: Joi.boolean().default(true).messages({
    "boolean.base": "Include charts must be a boolean value",
  }),

  scheduledDelivery: Joi.object({
    enabled: Joi.boolean().default(false),
    frequency: Joi.string().valid("daily", "weekly", "monthly").optional(),
    recipients: Joi.array().items(Joi.string().email()).max(10).optional(),
    time: Joi.string()
      .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .optional(),
  })
    .optional()
    .messages({
      "array.max": "Maximum 10 recipients can be specified",
      "string.pattern.base": "Time must be in HH:MM format",
    }),
});

// Report export validation schema
export const reportExportSchema = Joi.object({
  reportId: Joi.string().uuid({ version: "uuidv4" }).required().messages({
    "string.uuid": "Report ID must be a valid UUID",
    "any.required": "Report ID is required",
  }),

  format: Joi.string().valid("json", "csv", "xlsx", "pdf").required().messages({
    "any.only": "Format must be one of: json, csv, xlsx, pdf",
    "any.required": "Format is required",
  }),

  includeCharts: Joi.boolean()
    .default(true)
    .when("format", {
      is: Joi.valid("pdf", "xlsx"),
      then: Joi.boolean(),
      otherwise: Joi.boolean().default(false),
    })
    .messages({
      "boolean.base": "Include charts must be a boolean value",
    }),

  includeRawData: Joi.boolean().default(false).messages({
    "boolean.base": "Include raw data must be a boolean value",
  }),

  compression: Joi.string()
    .valid("none", "zip", "gzip")
    .default("none")
    .messages({
      "any.only": "Compression must be one of: none, zip, gzip",
    }),

  emailTo: Joi.array().items(Joi.string().email()).max(10).optional().messages({
    "array.max": "Maximum 10 email addresses can be provided",
    "string.email": "Each recipient must be a valid email address",
  }),

  password: Joi.string()
    .min(8)
    .max(50)
    .optional()
    .when("format", {
      is: "pdf",
      then: Joi.string().optional(),
      otherwise: Joi.forbidden(),
    })
    .messages({
      "string.min": "Password must be at least 8 characters",
      "string.max": "Password must not exceed 50 characters",
      "any.unknown": "Password protection is only available for PDF format",
    }),
});

// Report schedule validation schema
export const reportScheduleSchema = Joi.object({
  reportConfig: customReportSchema.required(),

  schedule: Joi.object({
    frequency: Joi.string()
      .valid("hourly", "daily", "weekly", "monthly", "quarterly")
      .required()
      .messages({
        "any.only":
          "Frequency must be one of: hourly, daily, weekly, monthly, quarterly",
        "any.required": "Frequency is required",
      }),

    time: Joi.string()
      .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .default("09:00")
      .messages({
        "string.pattern.base": "Time must be in HH:MM format",
      }),

    dayOfWeek: Joi.number()
      .integer()
      .min(0)
      .max(6)
      .optional()
      .when("frequency", {
        is: "weekly",
        then: Joi.required(),
      })
      .messages({
        "number.integer": "Day of week must be an integer",
        "number.min": "Day of week must be between 0 (Sunday) and 6 (Saturday)",
        "number.max": "Day of week must be between 0 (Sunday) and 6 (Saturday)",
        "any.required": "Day of week is required for weekly frequency",
      }),

    dayOfMonth: Joi.number()
      .integer()
      .min(1)
      .max(31)
      .optional()
      .when("frequency", {
        is: "monthly",
        then: Joi.required(),
      })
      .messages({
        "number.integer": "Day of month must be an integer",
        "number.min": "Day of month must be between 1 and 31",
        "number.max": "Day of month must be between 1 and 31",
        "any.required": "Day of month is required for monthly frequency",
      }),

    timezone: Joi.string().default("UTC").messages({
      "string.base": "Timezone must be a valid timezone string",
    }),

    startDate: Joi.date().iso().min("now").required().messages({
      "date.format": "Start date must be in ISO format",
      "date.min": "Start date must be in the future",
      "any.required": "Start date is required",
    }),

    endDate: Joi.date().iso().min(Joi.ref("startDate")).optional().messages({
      "date.format": "End date must be in ISO format",
      "date.min": "End date must be after start date",
    }),
  }).required(),

  recipients: Joi.array()
    .items(Joi.string().email())
    .min(1)
    .max(20)
    .required()
    .messages({
      "array.min": "At least one recipient must be provided",
      "array.max": "Maximum 20 recipients can be specified",
      "any.required": "Recipients are required",
    }),

  isActive: Joi.boolean().default(true).messages({
    "boolean.base": "Active status must be a boolean value",
  }),
});

// Export all report validation schemas
export {
  revenueReportSchema,
  userAnalyticsSchema,
  teacherPerformanceSchema,
  bookingAnalyticsSchema,
  platformMetricsSchema,
  customReportSchema,
  reportExportSchema,
  reportScheduleSchema,
};
