import Joi from "joi";

export const subjectOfferingSchema = Joi.object({
  subjectName: Joi.string().trim().min(2).max(100).required().messages({
    "string.min": "Subject name must be at least 2 characters long",
    "string.max": "Subject name cannot exceed 100 characters",
    "any.required": "Subject name is required",
  }),

  subjectNameUz: Joi.string().trim().min(2).max(100).optional().messages({
    "string.min": "Uzbek subject name must be at least 2 characters long",
    "string.max": "Uzbek subject name cannot exceed 100 characters",
  }),

  subjectNameRu: Joi.string().trim().min(2).max(100).optional().messages({
    "string.min": "Russian subject name must be at least 2 characters long",
    "string.max": "Russian subject name cannot exceed 100 characters",
  }),

  subjectNameEn: Joi.string().trim().min(2).max(100).optional().messages({
    "string.min": "English subject name must be at least 2 characters long",
    "string.max": "English subject name cannot exceed 100 characters",
  }),

  level: Joi.string()
    .valid(
      "ALL_LEVELS",
      "BEGINNER",
      "ELEMENTARY",
      "INTERMEDIATE",
      "UPPER_INTERMEDIATE",
      "ADVANCED",
      "INTERMEDIATE_PLUS",
    )
    .required()
    .messages({
      "any.only":
        "Level must be one of: ALL_LEVELS, BEGINNER, ELEMENTARY, INTERMEDIATE, UPPER_INTERMEDIATE, ADVANCED, INTERMEDIATE_PLUS",
      "any.required": "Level is required",
    }),

  pricePerHour: Joi.number()
    .integer()
    .min(1000)
    .max(1000000)
    .required()
    .messages({
      "number.min": "Price per hour must be at least 1,000 UZS",
      "number.max": "Price per hour cannot exceed 1,000,000 UZS",
      "any.required": "Price per hour is required",
    }),

  delivery: Joi.string()
    .valid("ONLINE", "OFFLINE", "HYBRID")
    .default("ONLINE")
    .messages({
      "any.only": "Delivery type must be one of: ONLINE, OFFLINE, HYBRID",
    }),

  icon: Joi.string()
    .valid("BOOK", "BAR_CHART", "BRIEFCASE", "SPEECH_BUBBLE")
    .default("BOOK")
    .messages({
      "any.only":
        "Icon must be one of: BOOK, BAR_CHART, BRIEFCASE, SPEECH_BUBBLE",
    }),

  status: Joi.string().valid("DRAFT", "PUBLISHED").default("DRAFT").messages({
    "any.only": "Status must be either DRAFT or PUBLISHED",
  }),
});

export const updateOfferingSchema = Joi.object({
  subjectName: Joi.string().trim().min(2).max(100).optional().messages({
    "string.min": "Subject name must be at least 2 characters long",
    "string.max": "Subject name cannot exceed 100 characters",
  }),

  subjectNameUz: Joi.string().trim().min(2).max(100).optional().messages({
    "string.min": "Uzbek subject name must be at least 2 characters long",
    "string.max": "Uzbek subject name cannot exceed 100 characters",
  }),

  subjectNameRu: Joi.string().trim().min(2).max(100).optional().messages({
    "string.min": "Russian subject name must be at least 2 characters long",
    "string.max": "Russian subject name cannot exceed 100 characters",
  }),

  subjectNameEn: Joi.string().trim().min(2).max(100).optional().messages({
    "string.min": "English subject name must be at least 2 characters long",
    "string.max": "English subject name cannot exceed 100 characters",
  }),

  level: Joi.string()
    .valid(
      "ALL_LEVELS",
      "BEGINNER",
      "ELEMENTARY",
      "INTERMEDIATE",
      "UPPER_INTERMEDIATE",
      "ADVANCED",
      "INTERMEDIATE_PLUS",
    )
    .optional()
    .messages({
      "any.only":
        "Level must be one of: ALL_LEVELS, BEGINNER, ELEMENTARY, INTERMEDIATE, UPPER_INTERMEDIATE, ADVANCED, INTERMEDIATE_PLUS",
    }),

  pricePerHour: Joi.number()
    .integer()
    .min(1000)
    .max(1000000)
    .optional()
    .messages({
      "number.min": "Price per hour must be at least 1,000 UZS",
      "number.max": "Price per hour cannot exceed 1,000,000 UZS",
    }),

  delivery: Joi.string()
    .valid("ONLINE", "OFFLINE", "HYBRID")
    .optional()
    .messages({
      "any.only": "Delivery type must be one of: ONLINE, OFFLINE, HYBRID",
    }),

  icon: Joi.string()
    .valid("BOOK", "BAR_CHART", "BRIEFCASE", "SPEECH_BUBBLE")
    .optional()
    .messages({
      "any.only":
        "Icon must be one of: BOOK, BAR_CHART, BRIEFCASE, SPEECH_BUBBLE",
    }),

  status: Joi.string()
    .valid("DRAFT", "PUBLISHED", "ARCHIVED")
    .optional()
    .messages({
      "any.only": "Status must be one of: DRAFT, PUBLISHED, ARCHIVED",
    }),
});

export const teacherChipsSchema = Joi.object({
  teachingLevels: Joi.array()
    .items(
      Joi.string().valid(
        "Beginner",
        "Elementary",
        "Intermediate",
        "Upper-Intermediate",
        "Advanced",
      ),
    )
    .unique()
    .max(5)
    .default([])
    .messages({
      "array.unique": "Teaching levels must be unique",
      "array.max": "Maximum 5 teaching levels allowed",
      "any.only": "Invalid teaching level",
    }),

  examPreparation: Joi.array()
    .items(
      Joi.string().valid(
        "IELTS",
        "TOEFL",
        "Cambridge English",
        "Business English Certificate",
        "OET",
        "TOEIC",
        "PTE",
      ),
    )
    .unique()
    .max(7)
    .default([])
    .messages({
      "array.unique": "Exam preparation types must be unique",
      "array.max": "Maximum 7 exam preparation types allowed",
      "any.only": "Invalid exam preparation type",
    }),
});

export const subjectSearchSchema = Joi.object({
  query: Joi.string().trim().min(1).max(100).optional().messages({
    "string.min": "Search query cannot be empty",
    "string.max": "Search query cannot exceed 100 characters",
  }),

  subjects: Joi.array()
    .items(Joi.string().trim().min(1).max(100))
    .unique()
    .max(10)
    .optional()
    .messages({
      "array.unique": "Subject filters must be unique",
      "array.max": "Maximum 10 subject filters allowed",
    }),

  levels: Joi.array()
    .items(
      Joi.string().valid(
        "ALL_LEVELS",
        "BEGINNER",
        "ELEMENTARY",
        "INTERMEDIATE",
        "UPPER_INTERMEDIATE",
        "ADVANCED",
        "INTERMEDIATE_PLUS",
      ),
    )
    .unique()
    .max(7)
    .optional()
    .messages({
      "array.unique": "Level filters must be unique",
      "array.max": "Maximum 7 level filters allowed",
      "any.only": "Invalid level filter",
    }),

  delivery: Joi.array()
    .items(Joi.string().valid("ONLINE", "OFFLINE", "HYBRID"))
    .unique()
    .max(3)
    .optional()
    .messages({
      "array.unique": "Delivery filters must be unique",
      "array.max": "Maximum 3 delivery filters allowed",
      "any.only": "Invalid delivery filter",
    }),

  priceMin: Joi.number().integer().min(0).max(1000000).optional().messages({
    "number.min": "Minimum price cannot be negative",
    "number.max": "Minimum price cannot exceed 1,000,000 UZS",
  }),

  priceMax: Joi.number()
    .integer()
    .min(Joi.ref("priceMin"))
    .max(1000000)
    .optional()
    .messages({
      "number.min": "Maximum price must be greater than minimum price",
      "number.max": "Maximum price cannot exceed 1,000,000 UZS",
    }),

  teacherRatingMin: Joi.number().min(1).max(5).optional().messages({
    "number.min": "Minimum rating must be at least 1",
    "number.max": "Minimum rating cannot exceed 5",
  }),

  verifiedOnly: Joi.boolean().default(false),

  page: Joi.number().integer().min(1).default(1).messages({
    "number.min": "Page number must be at least 1",
  }),

  limit: Joi.number().integer().min(1).max(100).default(20).messages({
    "number.min": "Limit must be at least 1",
    "number.max": "Limit cannot exceed 100",
  }),

  sortBy: Joi.string()
    .valid("relevance", "price", "rating", "experience", "lessons")
    .default("relevance")
    .messages({
      "any.only":
        "Sort by must be one of: relevance, price, rating, experience, lessons",
    }),

  sortOrder: Joi.string().valid("asc", "desc").default("desc").messages({
    "any.only": "Sort order must be either asc or desc",
  }),
});

export default {
  subjectOfferingSchema,
  updateOfferingSchema,
  teacherChipsSchema,
  subjectSearchSchema,
};
