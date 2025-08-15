import Joi from "joi";

// Universal search validation schema
export const universalSearchSchema = Joi.object({
  query: Joi.string()
    .trim()
    .min(1)
    .max(200)
    .required()
    .messages({
      'string.min': 'Search query must be at least 1 character',
      'string.max': 'Search query must not exceed 200 characters',
      'any.required': 'Search query is required'
    }),
  
  type: Joi.string()
    .valid('all', 'teachers', 'students', 'subjects')
    .default('all')
    .messages({
      'any.only': 'Search type must be one of: all, teachers, students, subjects'
    }),
  
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1'
    }),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20)
    .messages({
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit must not exceed 100'
    }),
  
  sortBy: Joi.string()
    .valid('relevance', 'rating', 'price', 'experience', 'createdAt')
    .default('relevance')
    .messages({
      'any.only': 'Sort field must be one of: relevance, rating, price, experience, createdAt'
    }),
  
  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
    .messages({
      'any.only': 'Sort order must be either asc or desc'
    })
});

// Teacher search validation schema
export const teacherSearchSchema = Joi.object({
  query: Joi.string()
    .trim()
    .min(1)
    .max(200)
    .optional()
    .allow('')
    .messages({
      'string.min': 'Search query must be at least 1 character',
      'string.max': 'Search query must not exceed 200 characters'
    }),
  
  subjects: Joi.alternatives()
    .try(
      Joi.string(),
      Joi.array().items(Joi.string().trim().min(1)).min(1).max(20)
    )
    .optional()
    .messages({
      'array.min': 'At least one subject must be provided',
      'array.max': 'Maximum 20 subjects can be selected'
    }),
  
  minRating: Joi.number()
    .min(1)
    .max(5)
    .optional()
    .messages({
      'number.min': 'Minimum rating must be at least 1',
      'number.max': 'Minimum rating must not exceed 5'
    }),
  
  maxRating: Joi.number()
    .min(1)
    .max(5)
    .optional()
    .when('minRating', {
      is: Joi.exist(),
      then: Joi.number().min(Joi.ref('minRating')),
    })
    .messages({
      'number.min': 'Maximum rating must be at least 1',
      'number.max': 'Maximum rating must not exceed 5',
      'number.ref': 'Maximum rating must be greater than or equal to minimum rating'
    }),
  
  minPrice: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.min': 'Minimum price must be at least 0'
    }),
  
  maxPrice: Joi.number()
    .min(0)
    .optional()
    .when('minPrice', {
      is: Joi.exist(),
      then: Joi.number().min(Joi.ref('minPrice')),
    })
    .messages({
      'number.min': 'Maximum price must be at least 0',
      'number.ref': 'Maximum price must be greater than or equal to minimum price'
    }),
  
  experienceLevel: Joi.alternatives()
    .try(
      Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert'),
      Joi.array().items(Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert')).min(1)
    )
    .optional()
    .messages({
      'any.only': 'Experience level must be one of: beginner, intermediate, advanced, expert'
    }),
  
  availability: Joi.string()
    .valid('available', 'all')
    .optional()
    .messages({
      'any.only': 'Availability must be either available or all'
    }),
  
  location: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Location must be at least 1 character',
      'string.max': 'Location must not exceed 100 characters'
    }),
  
  languages: Joi.alternatives()
    .try(
      Joi.string(),
      Joi.array().items(Joi.string().trim().min(1)).min(1).max(10)
    )
    .optional()
    .messages({
      'array.min': 'At least one language must be provided',
      'array.max': 'Maximum 10 languages can be selected'
    }),
  
  sortBy: Joi.string()
    .valid('rating', 'price', 'experience', 'reviews', 'createdAt')
    .default('rating')
    .messages({
      'any.only': 'Sort field must be one of: rating, price, experience, reviews, createdAt'
    }),
  
  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
    .messages({
      'any.only': 'Sort order must be either asc or desc'
    }),
  
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1'
    }),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20)
    .messages({
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit must not exceed 100'
    })
});

// Student search validation schema (Admin only)
export const studentSearchSchema = Joi.object({
  query: Joi.string()
    .trim()
    .min(1)
    .max(200)
    .optional()
    .allow('')
    .messages({
      'string.min': 'Search query must be at least 1 character',
      'string.max': 'Search query must not exceed 200 characters'
    }),
  
  preferredSubjects: Joi.alternatives()
    .try(
      Joi.string(),
      Joi.array().items(Joi.string().trim().min(1)).min(1).max(20)
    )
    .optional()
    .messages({
      'array.min': 'At least one subject must be provided',
      'array.max': 'Maximum 20 subjects can be selected'
    }),
  
  registrationDate: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.format': 'Registration date must be in ISO format'
    }),
  
  isActive: Joi.string()
    .valid('true', 'false')
    .optional()
    .messages({
      'any.only': 'Active status must be either true or false'
    }),
  
  hasBookings: Joi.string()
    .valid('true', 'false')
    .optional()
    .messages({
      'any.only': 'Has bookings must be either true or false'
    }),
  
  sortBy: Joi.string()
    .valid('name', 'email', 'registrationDate', 'createdAt')
    .default('createdAt')
    .messages({
      'any.only': 'Sort field must be one of: name, email, registrationDate, createdAt'
    }),
  
  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
    .messages({
      'any.only': 'Sort order must be either asc or desc'
    }),
  
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1'
    }),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20)
    .messages({
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit must not exceed 100'
    })
});

// Subject search validation schema
export const subjectSearchSchema = Joi.object({
  query: Joi.string()
    .trim()
    .min(1)
    .max(200)
    .optional()
    .allow('')
    .messages({
      'string.min': 'Search query must be at least 1 character',
      'string.max': 'Search query must not exceed 200 characters'
    }),
  
  category: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Category must be at least 1 character',
      'string.max': 'Category must not exceed 100 characters'
    }),
  
  hasTeachers: Joi.string()
    .valid('true', 'false')
    .optional()
    .messages({
      'any.only': 'Has teachers must be either true or false'
    }),
  
  sortBy: Joi.string()
    .valid('name', 'popularity', 'category')
    .default('name')
    .messages({
      'any.only': 'Sort field must be one of: name, popularity, category'
    }),
  
  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('asc')
    .messages({
      'any.only': 'Sort order must be either asc or desc'
    }),
  
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1'
    }),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(50)
    .messages({
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit must not exceed 100'
    })
});

// Advanced search filter validation schema
export const advancedFilterSchema = Joi.object({
  textQuery: Joi.string()
    .trim()
    .min(1)
    .max(200)
    .optional()
    .allow('')
    .messages({
      'string.min': 'Text query must be at least 1 character',
      'string.max': 'Text query must not exceed 200 characters'
    }),
  
  teacherFilters: Joi.object({
    experienceYears: Joi.object({
      gte: Joi.number().min(0).optional(),
      lte: Joi.number().min(0).optional(),
    }).optional(),
    
    education: Joi.string()
      .trim()
      .min(1)
      .max(200)
      .optional()
      .messages({
        'string.min': 'Education must be at least 1 character',
        'string.max': 'Education must not exceed 200 characters'
      }),
    
    languages: Joi.array()
      .items(Joi.string().trim().min(1))
      .min(1)
      .max(10)
      .optional()
      .messages({
        'array.min': 'At least one language must be provided',
        'array.max': 'Maximum 10 languages can be selected'
      }),
    
    certifications: Joi.array()
      .items(Joi.string().trim().min(1))
      .max(20)
      .optional()
      .messages({
        'array.max': 'Maximum 20 certifications can be provided'
      })
  }).optional(),
  
  subjectFilters: Joi.object({
    subjects: Joi.array()
      .items(Joi.string().trim().min(1))
      .min(1)
      .max(20)
      .optional()
      .messages({
        'array.min': 'At least one subject must be provided',
        'array.max': 'Maximum 20 subjects can be selected'
      }),
    
    levels: Joi.array()
      .items(Joi.string().valid('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'))
      .min(1)
      .optional()
      .messages({
        'array.min': 'At least one level must be provided'
      }),
    
    categories: Joi.array()
      .items(Joi.string().trim().min(1))
      .max(10)
      .optional()
      .messages({
        'array.max': 'Maximum 10 categories can be selected'
      })
  }).optional(),
  
  locationFilters: Joi.object({
    city: Joi.string()
      .trim()
      .min(1)
      .max(100)
      .optional()
      .messages({
        'string.min': 'City must be at least 1 character',
        'string.max': 'City must not exceed 100 characters'
      }),
    
    region: Joi.string()
      .trim()
      .min(1)
      .max(100)
      .optional()
      .messages({
        'string.min': 'Region must be at least 1 character',
        'string.max': 'Region must not exceed 100 characters'
      }),
    
    country: Joi.string()
      .trim()
      .min(1)
      .max(100)
      .optional()
      .messages({
        'string.min': 'Country must be at least 1 character',
        'string.max': 'Country must not exceed 100 characters'
      }),
    
    radius: Joi.number()
      .min(1)
      .max(1000)
      .optional()
      .messages({
        'number.min': 'Radius must be at least 1 km',
        'number.max': 'Radius must not exceed 1000 km'
      })
  }).optional(),
  
  availabilityFilters: Joi.object({
    requiredSlots: Joi.number()
      .integer()
      .min(1)
      .max(50)
      .optional()
      .messages({
        'number.integer': 'Required slots must be an integer',
        'number.min': 'Required slots must be at least 1',
        'number.max': 'Required slots must not exceed 50'
      }),
    
    timeRange: Joi.object({
      start: Joi.string()
        .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .optional()
        .messages({
          'string.pattern.base': 'Start time must be in HH:MM format'
        }),
      
      end: Joi.string()
        .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .optional()
        .messages({
          'string.pattern.base': 'End time must be in HH:MM format'
        })
    }).optional(),
    
    daysOfWeek: Joi.array()
      .items(Joi.number().integer().min(0).max(6))
      .min(1)
      .max(7)
      .optional()
      .messages({
        'array.min': 'At least one day must be selected',
        'array.max': 'Maximum 7 days can be selected'
      })
  }).optional(),
  
  priceFilters: Joi.object({
    min: Joi.number()
      .min(0)
      .optional()
      .messages({
        'number.min': 'Minimum price must be at least 0'
      }),
    
    max: Joi.number()
      .min(0)
      .optional()
      .when('min', {
        is: Joi.exist(),
        then: Joi.number().min(Joi.ref('min')),
      })
      .messages({
        'number.min': 'Maximum price must be at least 0',
        'number.ref': 'Maximum price must be greater than or equal to minimum price'
      }),
    
    currency: Joi.string()
      .valid('USD', 'UZS', 'EUR', 'GBP')
      .optional()
      .messages({
        'any.only': 'Currency must be one of: USD, UZS, EUR, GBP'
      })
  }).optional(),
  
  ratingFilters: Joi.object({
    min: Joi.number()
      .min(1)
      .max(5)
      .optional()
      .messages({
        'number.min': 'Minimum rating must be at least 1',
        'number.max': 'Minimum rating must not exceed 5'
      }),
    
    max: Joi.number()
      .min(1)
      .max(5)
      .optional()
      .when('min', {
        is: Joi.exist(),
        then: Joi.number().min(Joi.ref('min')),
      })
      .messages({
        'number.min': 'Maximum rating must be at least 1',
        'number.max': 'Maximum rating must not exceed 5',
        'number.ref': 'Maximum rating must be greater than or equal to minimum rating'
      }),
    
    minReviews: Joi.number()
      .integer()
      .min(0)
      .optional()
      .messages({
        'number.integer': 'Minimum reviews must be an integer',
        'number.min': 'Minimum reviews must be at least 0'
      })
  }).optional(),
  
  sortBy: Joi.string()
    .valid('relevance', 'rating', 'price', 'experience', 'reviews', 'createdAt')
    .default('relevance')
    .messages({
      'any.only': 'Sort field must be one of: relevance, rating, price, experience, reviews, createdAt'
    }),
  
  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
    .messages({
      'any.only': 'Sort order must be either asc or desc'
    }),
  
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1'
    }),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20)
    .messages({
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit must not exceed 100'
    })
});

// Search suggestions validation schema
export const searchSuggestionsSchema = Joi.object({
  query: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Query must be at least 2 characters',
      'string.max': 'Query must not exceed 100 characters',
      'any.required': 'Query is required'
    }),
  
  type: Joi.string()
    .valid('all', 'teachers', 'subjects', 'locations')
    .default('all')
    .messages({
      'any.only': 'Suggestion type must be one of: all, teachers, subjects, locations'
    }),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(20)
    .default(10)
    .messages({
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit must not exceed 20'
    })
});

// Export all validation schemas
export {
  universalSearchSchema,
  teacherSearchSchema,
  studentSearchSchema,
  subjectSearchSchema,
  advancedFilterSchema,
  searchSuggestionsSchema
};
