import Joi from "joi";

export const createPaymentSchema = Joi.object({
  bookingId: Joi.string()
    .uuid()
    .when("packageId", {
      is: Joi.exist(),
      then: Joi.forbidden(),
      otherwise: Joi.required(),
    })
    .messages({
      "string.uuid": "Booking ID must be a valid UUID",
      "any.required": "Either booking ID or package ID is required",
      "any.unknown": "Cannot specify both booking ID and package ID",
    }),

  packageId: Joi.string()
    .uuid()
    .when("bookingId", {
      is: Joi.exist(),
      then: Joi.forbidden(),
      otherwise: Joi.required(),
    })
    .messages({
      "string.uuid": "Package ID must be a valid UUID",
      "any.required": "Either booking ID or package ID is required",
      "any.unknown": "Cannot specify both booking ID and package ID",
    }),

  provider: Joi.string()
    .valid("CLICK", "PAYME", "UZUM_BANK", "STRIPE")
    .required()
    .messages({
      "any.only": "Provider must be one of: CLICK, PAYME, UZUM_BANK, STRIPE",
      "any.required": "Payment provider is required",
    }),

  paymentMethodId: Joi.string().uuid().optional().messages({
    "string.uuid": "Payment method ID must be a valid UUID",
  }),

  returnUrl: Joi.string().uri().optional().messages({
    "string.uri": "Return URL must be a valid URL",
  }),

  cancelUrl: Joi.string().uri().optional().messages({
    "string.uri": "Cancel URL must be a valid URL",
  }),

  savePaymentMethod: Joi.boolean().default(false).messages({
    "boolean.base": "Save payment method must be a boolean value",
  }),

  metadata: Joi.object().optional().messages({
    "object.base": "Metadata must be an object",
  }),
});

export const paymentWebhookSchema = Joi.object({
  provider: Joi.string()
    .valid("CLICK", "PAYME", "UZUM_BANK", "STRIPE")
    .required()
    .messages({
      "any.only": "Provider must be one of: CLICK, PAYME, UZUM_BANK, STRIPE",
      "any.required": "Provider is required",
    }),

  // Webhook payload varies by provider, so we allow any object
  payload: Joi.object().unknown(true).required().messages({
    "any.required": "Webhook payload is required",
  }),

  signature: Joi.string().optional().messages({
    "string.base": "Signature must be a string",
  }),

  timestamp: Joi.date().optional().messages({
    "date.base": "Timestamp must be a valid date",
  }),
});

export const paymentQuerySchema = Joi.object({
  status: Joi.alternatives()
    .try(
      Joi.string().valid(
        "PENDING",
        "COMPLETED",
        "FAILED",
        "REFUNDED",
        "PARTIALLY_REFUNDED",
      ),
      Joi.array()
        .items(
          Joi.string().valid(
            "PENDING",
            "COMPLETED",
            "FAILED",
            "REFUNDED",
            "PARTIALLY_REFUNDED",
          ),
        )
        .unique(),
    )
    .optional()
    .messages({
      "any.only":
        "Status must be one of: PENDING, COMPLETED, FAILED, REFUNDED, PARTIALLY_REFUNDED",
      "array.unique": "Status values must be unique",
    }),

  provider: Joi.alternatives()
    .try(
      Joi.string().valid("CLICK", "PAYME", "UZUM_BANK", "STRIPE"),
      Joi.array()
        .items(Joi.string().valid("CLICK", "PAYME", "UZUM_BANK", "STRIPE"))
        .unique(),
    )
    .optional()
    .messages({
      "any.only": "Provider must be one of: CLICK, PAYME, UZUM_BANK, STRIPE",
      "array.unique": "Provider values must be unique",
    }),

  bookingId: Joi.string().uuid().optional().messages({
    "string.uuid": "Booking ID must be a valid UUID",
  }),

  packageId: Joi.string().uuid().optional().messages({
    "string.uuid": "Package ID must be a valid UUID",
  }),

  startDate: Joi.date().iso().optional().messages({
    "date.format": "Start date must be in ISO format",
  }),

  endDate: Joi.date().iso().min(Joi.ref("startDate")).optional().messages({
    "date.format": "End date must be in ISO format",
    "date.min": "End date must be after start date",
  }),

  minAmount: Joi.number().integer().min(0).optional().messages({
    "number.min": "Minimum amount cannot be negative",
  }),

  maxAmount: Joi.number()
    .integer()
    .min(Joi.ref("minAmount"))
    .optional()
    .messages({
      "number.min": "Maximum amount must be greater than minimum amount",
    }),

  page: Joi.number().integer().min(1).default(1).messages({
    "number.min": "Page number must be at least 1",
  }),

  limit: Joi.number().integer().min(1).max(100).default(20).messages({
    "number.min": "Limit must be at least 1",
    "number.max": "Limit cannot exceed 100",
  }),

  sortBy: Joi.string()
    .valid("createdAt", "amount", "status", "capturedAt")
    .default("createdAt")
    .messages({
      "any.only":
        "Sort by must be one of: createdAt, amount, status, capturedAt",
    }),

  sortOrder: Joi.string().valid("asc", "desc").default("desc").messages({
    "any.only": "Sort order must be either asc or desc",
  }),
});

export const refundSchema = Joi.object({
  amount: Joi.number()
    .integer()
    .min(100) // Minimum 1 UZS in kopeks
    .optional()
    .messages({
      "number.min": "Refund amount must be at least 1 UZS (100 kopeks)",
      "number.integer": "Amount must be an integer (kopeks)",
    }),

  reason: Joi.string().min(10).max(500).required().messages({
    "string.min": "Refund reason must be at least 10 characters long",
    "string.max": "Refund reason cannot exceed 500 characters",
    "any.required": "Refund reason is required",
  }),

  refundType: Joi.string().valid("FULL", "PARTIAL").default("FULL").messages({
    "any.only": "Refund type must be either FULL or PARTIAL",
  }),

  notifyCustomer: Joi.boolean().default(true).messages({
    "boolean.base": "Notify customer must be a boolean value",
  }),

  metadata: Joi.object().optional().messages({
    "object.base": "Metadata must be an object",
  }),
});

export const payoutRequestSchema = Joi.object({
  amount: Joi.number()
    .integer()
    .min(1000) // Minimum 10 UZS in kopeks
    .max(10000000) // Maximum 100,000 UZS in kopeks
    .required()
    .messages({
      "number.min": "Payout amount must be at least 10 UZS (1,000 kopeks)",
      "number.max":
        "Payout amount cannot exceed 100,000 UZS (10,000,000 kopeks)",
      "number.integer": "Amount must be an integer (kopeks)",
      "any.required": "Payout amount is required",
    }),

  method: Joi.string()
    .valid("BANK_TRANSFER", "CARD", "UZUM_BANK", "CLICK")
    .required()
    .messages({
      "any.only":
        "Payout method must be one of: BANK_TRANSFER, CARD, UZUM_BANK, CLICK",
      "any.required": "Payout method is required",
    }),

  accountRef: Joi.string().min(5).max(100).required().messages({
    "string.min": "Account reference must be at least 5 characters long",
    "string.max": "Account reference cannot exceed 100 characters",
    "any.required": "Account reference is required",
  }),

  bankDetails: Joi.object({
    bankName: Joi.string().min(2).max(100).required(),
    accountNumber: Joi.string().min(5).max(50).required(),
    routingNumber: Joi.string().min(5).max(20).optional(),
    accountHolderName: Joi.string().min(2).max(100).required(),
    swift: Joi.string().length(8).optional(),
  })
    .when("method", {
      is: "BANK_TRANSFER",
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    })
    .messages({
      "any.required": "Bank details are required for bank transfer payouts",
      "any.unknown": "Bank details are not allowed for this payout method",
    }),

  cardDetails: Joi.object({
    last4: Joi.string().length(4).pattern(/^\d+$/).required(),
    brand: Joi.string()
      .valid("VISA", "MASTERCARD", "UZCARD", "HUMO")
      .required(),
    holderName: Joi.string().min(2).max(100).required(),
  })
    .when("method", {
      is: "CARD",
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    })
    .messages({
      "any.required": "Card details are required for card payouts",
      "any.unknown": "Card details are not allowed for this payout method",
    }),

  notes: Joi.string().max(500).optional().messages({
    "string.max": "Notes cannot exceed 500 characters",
  }),

  urgentPayout: Joi.boolean().default(false).messages({
    "boolean.base": "Urgent payout must be a boolean value",
  }),
});

export const paymentMethodSchema = Joi.object({
  provider: Joi.string()
    .valid("CLICK", "PAYME", "UZUM_BANK", "STRIPE")
    .required()
    .messages({
      "any.only": "Provider must be one of: CLICK, PAYME, UZUM_BANK, STRIPE",
      "any.required": "Provider is required",
    }),

  token: Joi.string().min(10).max(500).required().messages({
    "string.min": "Payment method token must be at least 10 characters",
    "string.max": "Payment method token cannot exceed 500 characters",
    "any.required": "Payment method token is required",
  }),

  last4: Joi.string().length(4).pattern(/^\d+$/).optional().messages({
    "string.length": "Last 4 digits must be exactly 4 characters",
    "string.pattern.base": "Last 4 digits must contain only numbers",
  }),

  expiryMonth: Joi.number().integer().min(1).max(12).optional().messages({
    "number.min": "Expiry month must be between 1 and 12",
    "number.max": "Expiry month must be between 1 and 12",
  }),

  expiryYear: Joi.number()
    .integer()
    .min(new Date().getFullYear())
    .max(new Date().getFullYear() + 20)
    .optional()
    .messages({
      "number.min": "Expiry year cannot be in the past",
      "number.max": "Expiry year cannot be more than 20 years in the future",
    }),

  isDefault: Joi.boolean().default(false).messages({
    "boolean.base": "Is default must be a boolean value",
  }),

  billingAddress: Joi.object({
    country: Joi.string().length(2).required(),
    city: Joi.string().min(2).max(100).required(),
    line1: Joi.string().min(5).max(200).required(),
    line2: Joi.string().max(200).optional(),
    postalCode: Joi.string().min(3).max(20).optional(),
  })
    .optional()
    .messages({
      "object.base": "Billing address must be an object",
    }),
});

export const paymentStatsSchema = Joi.object({
  startDate: Joi.date().iso().optional().messages({
    "date.format": "Start date must be in ISO format",
  }),

  endDate: Joi.date().iso().min(Joi.ref("startDate")).optional().messages({
    "date.format": "End date must be in ISO format",
    "date.min": "End date must be after start date",
  }),

  groupBy: Joi.string()
    .valid("day", "week", "month", "quarter", "year")
    .default("month")
    .messages({
      "any.only": "Group by must be one of: day, week, month, quarter, year",
    }),

  metrics: Joi.array()
    .items(
      Joi.string().valid(
        "total_amount",
        "transaction_count",
        "success_rate",
        "refund_rate",
        "average_amount",
        "commission_earned",
      ),
    )
    .unique()
    .default(["total_amount", "transaction_count"])
    .messages({
      "array.unique": "Metrics must be unique",
      "any.only": "Invalid metric specified",
    }),

  providers: Joi.array()
    .items(Joi.string().valid("CLICK", "PAYME", "UZUM_BANK", "STRIPE"))
    .unique()
    .optional()
    .messages({
      "array.unique": "Provider filters must be unique",
      "any.only": "Invalid provider specified",
    }),

  currency: Joi.string().valid("UZS", "USD", "EUR").default("UZS").messages({
    "any.only": "Currency must be one of: UZS, USD, EUR",
  }),
});

export default {
  createPaymentSchema,
  paymentWebhookSchema,
  paymentQuerySchema,
  refundSchema,
  payoutRequestSchema,
  paymentMethodSchema,
  paymentStatsSchema,
};
