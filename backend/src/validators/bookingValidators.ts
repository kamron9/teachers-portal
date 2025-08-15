import Joi from 'joi';

export const createBookingSchema = Joi.object({
  teacherId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.uuid': 'Teacher ID must be a valid UUID',
      'any.required': 'Teacher ID is required'
    }),

  subjectOfferingId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.uuid': 'Subject offering ID must be a valid UUID',
      'any.required': 'Subject offering ID is required'
    }),

  startAt: Joi.date()
    .iso()
    .min('now')
    .required()
    .messages({
      'date.format': 'Start time must be in ISO format',
      'date.min': 'Start time cannot be in the past',
      'any.required': 'Start time is required'
    }),

  endAt: Joi.date()
    .iso()
    .min(Joi.ref('startAt'))
    .required()
    .custom((value, helpers) => {
      const startAt = helpers.state.ancestors[0].startAt;
      if (startAt) {
        const durationMinutes = (new Date(value).getTime() - new Date(startAt).getTime()) / (1000 * 60);
        if (durationMinutes < 30) {
          return helpers.error('endAt.minDuration');
        }
        if (durationMinutes > 180) {
          return helpers.error('endAt.maxDuration');
        }
      }
      return value;
    })
    .messages({
      'date.format': 'End time must be in ISO format',
      'date.min': 'End time must be after start time',
      'any.required': 'End time is required',
      'endAt.minDuration': 'Lesson duration must be at least 30 minutes',
      'endAt.maxDuration': 'Lesson duration cannot exceed 180 minutes'
    }),

  type: Joi.string()
    .valid('TRIAL', 'SINGLE', 'PACKAGE')
    .default('SINGLE')
    .messages({
      'any.only': 'Booking type must be one of: TRIAL, SINGLE, PACKAGE'
    }),

  studentTimezone: Joi.string()
    .default('Asia/Tashkent')
    .messages({
      'string.base': 'Student timezone must be a valid timezone string'
    }),

  packageId: Joi.string()
    .uuid()
    .when('type', {
      is: 'PACKAGE',
      then: Joi.required(),
      otherwise: Joi.forbidden()
    })
    .messages({
      'string.uuid': 'Package ID must be a valid UUID',
      'any.required': 'Package ID is required for package bookings',
      'any.unknown': 'Package ID is not allowed for non-package bookings'
    }),

  specialRequests: Joi.string()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Special requests cannot exceed 500 characters'
    })
});

export const updateBookingSchema = Joi.object({
  status: Joi.string()
    .valid('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW')
    .optional()
    .messages({
      'any.only': 'Status must be one of: PENDING, CONFIRMED, COMPLETED, CANCELLED, NO_SHOW'
    }),

  lessonNotes: Joi.string()
    .max(1000)
    .optional()
    .messages({
      'string.max': 'Lesson notes cannot exceed 1000 characters'
    }),

  studentAttended: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'Student attended must be a boolean value'
    }),

  teacherAttended: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'Teacher attended must be a boolean value'
    }),

  actualStartAt: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.format': 'Actual start time must be in ISO format'
    }),

  actualEndAt: Joi.date()
    .iso()
    .min(Joi.ref('actualStartAt'))
    .optional()
    .messages({
      'date.format': 'Actual end time must be in ISO format',
      'date.min': 'Actual end time must be after actual start time'
    })
});

export const bookingQuerySchema = Joi.object({
  status: Joi.alternatives()
    .try(
      Joi.string().valid('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'),
      Joi.array().items(Joi.string().valid('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW')).unique()
    )
    .optional()
    .messages({
      'any.only': 'Status must be one of: PENDING, CONFIRMED, COMPLETED, CANCELLED, NO_SHOW',
      'array.unique': 'Status values must be unique'
    }),

  type: Joi.alternatives()
    .try(
      Joi.string().valid('TRIAL', 'SINGLE', 'PACKAGE'),
      Joi.array().items(Joi.string().valid('TRIAL', 'SINGLE', 'PACKAGE')).unique()
    )
    .optional()
    .messages({
      'any.only': 'Type must be one of: TRIAL, SINGLE, PACKAGE',
      'array.unique': 'Type values must be unique'
    }),

  startDate: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.format': 'Start date must be in ISO format'
    }),

  endDate: Joi.date()
    .iso()
    .min(Joi.ref('startDate'))
    .optional()
    .messages({
      'date.format': 'End date must be in ISO format',
      'date.min': 'End date must be after start date'
    }),

  teacherId: Joi.string()
    .uuid()
    .optional()
    .messages({
      'string.uuid': 'Teacher ID must be a valid UUID'
    }),

  studentId: Joi.string()
    .uuid()
    .optional()
    .messages({
      'string.uuid': 'Student ID must be a valid UUID'
    }),

  subjectOfferingId: Joi.string()
    .uuid()
    .optional()
    .messages({
      'string.uuid': 'Subject offering ID must be a valid UUID'
    }),

  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.min': 'Page number must be at least 1'
    }),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20)
    .messages({
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100'
    }),

  sortBy: Joi.string()
    .valid('startAt', 'endAt', 'createdAt', 'status', 'priceAtBooking')
    .default('startAt')
    .messages({
      'any.only': 'Sort by must be one of: startAt, endAt, createdAt, status, priceAtBooking'
    }),

  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
    .messages({
      'any.only': 'Sort order must be either asc or desc'
    })
});

export const rescheduleBookingSchema = Joi.object({
  newStartAt: Joi.date()
    .iso()
    .min('now')
    .required()
    .messages({
      'date.format': 'New start time must be in ISO format',
      'date.min': 'New start time cannot be in the past',
      'any.required': 'New start time is required'
    }),

  newEndAt: Joi.date()
    .iso()
    .min(Joi.ref('newStartAt'))
    .required()
    .custom((value, helpers) => {
      const startAt = helpers.state.ancestors[0].newStartAt;
      if (startAt) {
        const durationMinutes = (new Date(value).getTime() - new Date(startAt).getTime()) / (1000 * 60);
        if (durationMinutes < 30) {
          return helpers.error('newEndAt.minDuration');
        }
        if (durationMinutes > 180) {
          return helpers.error('newEndAt.maxDuration');
        }
      }
      return value;
    })
    .messages({
      'date.format': 'New end time must be in ISO format',
      'date.min': 'New end time must be after new start time',
      'any.required': 'New end time is required',
      'newEndAt.minDuration': 'Lesson duration must be at least 30 minutes',
      'newEndAt.maxDuration': 'Lesson duration cannot exceed 180 minutes'
    }),

  reason: Joi.string()
    .min(10)
    .max(500)
    .required()
    .messages({
      'string.min': 'Reason must be at least 10 characters long',
      'string.max': 'Reason cannot exceed 500 characters',
      'any.required': 'Reason for rescheduling is required'
    }),

  notifyOtherParty: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'Notify other party must be a boolean value'
    })
});

export const cancelBookingSchema = Joi.object({
  reason: Joi.string()
    .min(10)
    .max(500)
    .required()
    .messages({
      'string.min': 'Cancellation reason must be at least 10 characters long',
      'string.max': 'Cancellation reason cannot exceed 500 characters',
      'any.required': 'Cancellation reason is required'
    }),

  requestRefund: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'Request refund must be a boolean value'
    }),

  notifyOtherParty: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'Notify other party must be a boolean value'
    })
});

export const attendanceSchema = Joi.object({
  studentAttended: Joi.boolean()
    .required()
    .messages({
      'boolean.base': 'Student attended must be a boolean value',
      'any.required': 'Student attendance status is required'
    }),

  teacherAttended: Joi.boolean()
    .required()
    .messages({
      'boolean.base': 'Teacher attended must be a boolean value',
      'any.required': 'Teacher attendance status is required'
    }),

  actualStartAt: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.format': 'Actual start time must be in ISO format'
    }),

  actualEndAt: Joi.date()
    .iso()
    .min(Joi.ref('actualStartAt'))
    .optional()
    .messages({
      'date.format': 'Actual end time must be in ISO format',
      'date.min': 'Actual end time must be after actual start time'
    }),

  lessonNotes: Joi.string()
    .max(1000)
    .optional()
    .messages({
      'string.max': 'Lesson notes cannot exceed 1000 characters'
    }),

  homeworkAssigned: Joi.string()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Homework assignment cannot exceed 500 characters'
    }),

  nextLessonTopics: Joi.string()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Next lesson topics cannot exceed 500 characters'
    }),

  studentProgress: Joi.object({
    skillsImproved: Joi.array()
      .items(Joi.string().max(100))
      .max(10)
      .optional()
      .messages({
        'array.max': 'Maximum 10 skill improvements can be listed'
      }),

    areasToFocus: Joi.array()
      .items(Joi.string().max(100))
      .max(10)
      .optional()
      .messages({
        'array.max': 'Maximum 10 areas to focus can be listed'
      }),

    difficultyLevel: Joi.string()
      .valid('VERY_EASY', 'EASY', 'MODERATE', 'DIFFICULT', 'VERY_DIFFICULT')
      .optional()
      .messages({
        'any.only': 'Difficulty level must be one of: VERY_EASY, EASY, MODERATE, DIFFICULT, VERY_DIFFICULT'
      }),

    studentEngagement: Joi.string()
      .valid('VERY_LOW', 'LOW', 'MODERATE', 'HIGH', 'VERY_HIGH')
      .optional()
      .messages({
        'any.only': 'Student engagement must be one of: VERY_LOW, LOW, MODERATE, HIGH, VERY_HIGH'
      })
    })
    .optional()
});

export const bulkUpdateBookingsSchema = Joi.object({
  bookingIds: Joi.array()
    .items(Joi.string().uuid())
    .min(1)
    .max(50)
    .unique()
    .required()
    .messages({
      'array.min': 'At least one booking ID is required',
      'array.max': 'Maximum 50 bookings can be updated at once',
      'array.unique': 'Booking IDs must be unique',
      'any.required': 'Booking IDs array is required'
    }),

  updates: Joi.object({
    status: Joi.string()
      .valid('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW')
      .optional(),

    lessonNotes: Joi.string()
      .max(1000)
      .optional(),

    reason: Joi.string()
      .max(500)
      .optional()
  })
    .min(1)
    .required()
    .messages({
      'object.min': 'At least one update field is required',
      'any.required': 'Updates object is required'
    }),

  notifyParties: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'Notify parties must be a boolean value'
    })
});

export const bookingStatsSchema = Joi.object({
  startDate: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.format': 'Start date must be in ISO format'
    }),

  endDate: Joi.date()
    .iso()
    .min(Joi.ref('startDate'))
    .optional()
    .messages({
      'date.format': 'End date must be in ISO format',
      'date.min': 'End date must be after start date'
    }),

  groupBy: Joi.string()
    .valid('day', 'week', 'month', 'quarter', 'year')
    .default('month')
    .messages({
      'any.only': 'Group by must be one of: day, week, month, quarter, year'
    }),

  metrics: Joi.array()
    .items(
      Joi.string().valid(
        'count',
        'revenue',
        'completion_rate',
        'cancellation_rate',
        'average_rating',
        'no_show_rate'
      )
    )
    .unique()
    .default(['count', 'revenue'])
    .messages({
      'array.unique': 'Metrics must be unique',
      'any.only': 'Invalid metric specified'
    }),

  timezone: Joi.string()
    .default('Asia/Tashkent')
    .messages({
      'string.base': 'Timezone must be a valid timezone string'
    })
});

export default {
  createBookingSchema,
  updateBookingSchema,
  bookingQuerySchema,
  rescheduleBookingSchema,
  cancelBookingSchema,
  attendanceSchema,
  bulkUpdateBookingsSchema,
  bookingStatsSchema,
};
