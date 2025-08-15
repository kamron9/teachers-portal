import Joi from "joi";

export const createReviewSchema = Joi.object({
  teacherId: Joi.string().uuid().required().messages({
    "string.uuid": "Teacher ID must be a valid UUID",
    "any.required": "Teacher ID is required",
  }),

  bookingId: Joi.string().uuid().required().messages({
    "string.uuid": "Booking ID must be a valid UUID",
    "any.required": "Booking ID is required",
  }),

  rating: Joi.number().integer().min(1).max(5).required().messages({
    "number.min": "Rating must be between 1 and 5",
    "number.max": "Rating must be between 1 and 5",
    "number.integer": "Rating must be a whole number",
    "any.required": "Rating is required",
  }),

  comment: Joi.string().trim().min(10).max(1000).optional().messages({
    "string.min": "Comment must be at least 10 characters long",
    "string.max": "Comment cannot exceed 1000 characters",
  }),

  isAnonymous: Joi.boolean().default(false).messages({
    "boolean.base": "Anonymous flag must be a boolean value",
  }),

  tags: Joi.array()
    .items(
      Joi.string().valid(
        "PATIENT",
        "KNOWLEDGEABLE",
        "WELL_PREPARED",
        "PUNCTUAL",
        "ENGAGING",
        "HELPFUL",
        "PROFESSIONAL",
        "ENCOURAGING",
        "CLEAR_EXPLANATIONS",
        "GOOD_MATERIALS",
      ),
    )
    .unique()
    .max(5)
    .optional()
    .messages({
      "array.unique": "Tags must be unique",
      "array.max": "Maximum 5 tags allowed",
      "any.only": "Invalid tag provided",
    }),

  wouldRecommend: Joi.boolean().optional().messages({
    "boolean.base": "Would recommend must be a boolean value",
  }),

  lessonQuality: Joi.object({
    content: Joi.number().integer().min(1).max(5).optional(),
    delivery: Joi.number().integer().min(1).max(5).optional(),
    materials: Joi.number().integer().min(1).max(5).optional(),
    interaction: Joi.number().integer().min(1).max(5).optional(),
  })
    .optional()
    .messages({
      "object.base": "Lesson quality must be an object",
    }),
});

export const updateReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).optional().messages({
    "number.min": "Rating must be between 1 and 5",
    "number.max": "Rating must be between 1 and 5",
    "number.integer": "Rating must be a whole number",
  }),

  comment: Joi.string().trim().min(10).max(1000).optional().messages({
    "string.min": "Comment must be at least 10 characters long",
    "string.max": "Comment cannot exceed 1000 characters",
  }),

  isAnonymous: Joi.boolean().optional().messages({
    "boolean.base": "Anonymous flag must be a boolean value",
  }),

  tags: Joi.array()
    .items(
      Joi.string().valid(
        "PATIENT",
        "KNOWLEDGEABLE",
        "WELL_PREPARED",
        "PUNCTUAL",
        "ENGAGING",
        "HELPFUL",
        "PROFESSIONAL",
        "ENCOURAGING",
        "CLEAR_EXPLANATIONS",
        "GOOD_MATERIALS",
      ),
    )
    .unique()
    .max(5)
    .optional()
    .messages({
      "array.unique": "Tags must be unique",
      "array.max": "Maximum 5 tags allowed",
      "any.only": "Invalid tag provided",
    }),

  wouldRecommend: Joi.boolean().optional().messages({
    "boolean.base": "Would recommend must be a boolean value",
  }),

  lessonQuality: Joi.object({
    content: Joi.number().integer().min(1).max(5).optional(),
    delivery: Joi.number().integer().min(1).max(5).optional(),
    materials: Joi.number().integer().min(1).max(5).optional(),
    interaction: Joi.number().integer().min(1).max(5).optional(),
  })
    .optional()
    .messages({
      "object.base": "Lesson quality must be an object",
    }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

export const reviewQuerySchema = Joi.object({
  rating: Joi.alternatives()
    .try(
      Joi.number().integer().min(1).max(5),
      Joi.array().items(Joi.number().integer().min(1).max(5)).unique(),
    )
    .optional()
    .messages({
      "number.min": "Rating must be between 1 and 5",
      "number.max": "Rating must be between 1 and 5",
      "array.unique": "Rating values must be unique",
    }),

  subject: Joi.string().trim().min(1).max(100).optional().messages({
    "string.min": "Subject filter cannot be empty",
    "string.max": "Subject filter cannot exceed 100 characters",
  }),

  status: Joi.string()
    .valid("PENDING", "APPROVED", "REJECTED")
    .default("APPROVED")
    .messages({
      "any.only": "Status must be one of: PENDING, APPROVED, REJECTED",
    }),

  includeAnonymous: Joi.boolean().default(true).messages({
    "boolean.base": "Include anonymous must be a boolean value",
  }),

  hasComment: Joi.boolean().optional().messages({
    "boolean.base": "Has comment must be a boolean value",
  }),

  tags: Joi.array()
    .items(
      Joi.string().valid(
        "PATIENT",
        "KNOWLEDGEABLE",
        "WELL_PREPARED",
        "PUNCTUAL",
        "ENGAGING",
        "HELPFUL",
        "PROFESSIONAL",
        "ENCOURAGING",
        "CLEAR_EXPLANATIONS",
        "GOOD_MATERIALS",
      ),
    )
    .unique()
    .optional()
    .messages({
      "array.unique": "Tag filters must be unique",
      "any.only": "Invalid tag filter provided",
    }),

  startDate: Joi.date().iso().optional().messages({
    "date.format": "Start date must be in ISO format",
  }),

  endDate: Joi.date().iso().min(Joi.ref("startDate")).optional().messages({
    "date.format": "End date must be in ISO format",
    "date.min": "End date must be after start date",
  }),

  page: Joi.number().integer().min(1).default(1).messages({
    "number.min": "Page number must be at least 1",
  }),

  limit: Joi.number().integer().min(1).max(100).default(20).messages({
    "number.min": "Limit must be at least 1",
    "number.max": "Limit cannot exceed 100",
  }),

  sortBy: Joi.string()
    .valid("createdAt", "rating", "helpful")
    .default("createdAt")
    .messages({
      "any.only": "Sort by must be one of: createdAt, rating, helpful",
    }),

  sortOrder: Joi.string().valid("asc", "desc").default("desc").messages({
    "any.only": "Sort order must be either asc or desc",
  }),
});

export const moderateReviewSchema = Joi.object({
  status: Joi.string().valid("APPROVED", "REJECTED").required().messages({
    "any.only": "Status must be either APPROVED or REJECTED",
    "any.required": "Moderation status is required",
  }),

  moderationReason: Joi.string()
    .trim()
    .min(10)
    .max(500)
    .when("status", {
      is: "REJECTED",
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      "string.min": "Moderation reason must be at least 10 characters long",
      "string.max": "Moderation reason cannot exceed 500 characters",
      "any.required": "Moderation reason is required for rejected reviews",
    }),

  adminNotes: Joi.string().trim().max(1000).optional().messages({
    "string.max": "Admin notes cannot exceed 1000 characters",
  }),
});

export const reviewResponseSchema = Joi.object({
  response: Joi.string().trim().min(10).max(500).required().messages({
    "string.min": "Response must be at least 10 characters long",
    "string.max": "Response cannot exceed 500 characters",
    "any.required": "Response is required",
  }),

  isPublic: Joi.boolean().default(true).messages({
    "boolean.base": "Is public must be a boolean value",
  }),
});

export const helpfulVoteSchema = Joi.object({
  helpful: Joi.boolean().required().messages({
    "boolean.base": "Helpful vote must be a boolean value",
    "any.required": "Helpful vote is required",
  }),
});

export const bulkModerationSchema = Joi.object({
  reviewIds: Joi.array()
    .items(Joi.string().uuid())
    .min(1)
    .max(50)
    .unique()
    .required()
    .messages({
      "array.min": "At least one review ID is required",
      "array.max": "Maximum 50 review IDs allowed",
      "array.unique": "Review IDs must be unique",
      "any.required": "Review IDs array is required",
    }),

  action: Joi.string()
    .valid("APPROVE", "REJECT", "FLAG_FOR_REVIEW")
    .required()
    .messages({
      "any.only": "Action must be one of: APPROVE, REJECT, FLAG_FOR_REVIEW",
      "any.required": "Action is required",
    }),

  reason: Joi.string()
    .trim()
    .min(10)
    .max(500)
    .when("action", {
      is: "REJECT",
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      "string.min": "Reason must be at least 10 characters long",
      "string.max": "Reason cannot exceed 500 characters",
      "any.required": "Reason is required for rejection",
    }),
});

export const reviewStatsSchema = Joi.object({
  teacherId: Joi.string().uuid().optional().messages({
    "string.uuid": "Teacher ID must be a valid UUID",
  }),

  startDate: Joi.date().iso().optional().messages({
    "date.format": "Start date must be in ISO format",
  }),

  endDate: Joi.date().iso().min(Joi.ref("startDate")).optional().messages({
    "date.format": "End date must be in ISO format",
    "date.min": "End date must be after start date",
  }),

  groupBy: Joi.string()
    .valid("day", "week", "month", "quarter")
    .default("month")
    .messages({
      "any.only": "Group by must be one of: day, week, month, quarter",
    }),

  metrics: Joi.array()
    .items(
      Joi.string().valid(
        "average_rating",
        "review_count",
        "response_rate",
        "rating_distribution",
        "tag_frequency",
        "recommendation_rate",
      ),
    )
    .unique()
    .default(["average_rating", "review_count"])
    .messages({
      "array.unique": "Metrics must be unique",
      "any.only": "Invalid metric specified",
    }),

  includeModerated: Joi.boolean().default(false).messages({
    "boolean.base": "Include moderated must be a boolean value",
  }),
});

export const reportReviewSchema = Joi.object({
  reason: Joi.string()
    .valid(
      "SPAM",
      "FAKE_REVIEW",
      "INAPPROPRIATE_CONTENT",
      "HARASSMENT",
      "OFF_TOPIC",
      "OTHER",
    )
    .required()
    .messages({
      "any.only":
        "Reason must be one of: SPAM, FAKE_REVIEW, INAPPROPRIATE_CONTENT, HARASSMENT, OFF_TOPIC, OTHER",
      "any.required": "Report reason is required",
    }),

  description: Joi.string().trim().min(10).max(500).optional().messages({
    "string.min": "Description must be at least 10 characters long",
    "string.max": "Description cannot exceed 500 characters",
  }),

  evidence: Joi.array()
    .items(
      Joi.object({
        type: Joi.string().valid("screenshot", "url", "text").required(),
        content: Joi.string().required(),
        description: Joi.string().optional(),
      }),
    )
    .max(5)
    .optional()
    .messages({
      "array.max": "Maximum 5 evidence items allowed",
    }),
});

export default {
  createReviewSchema,
  updateReviewSchema,
  reviewQuerySchema,
  moderateReviewSchema,
  reviewResponseSchema,
  helpfulVoteSchema,
  bulkModerationSchema,
  reviewStatsSchema,
  reportReviewSchema,
};
