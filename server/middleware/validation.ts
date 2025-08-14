import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return res.status(400).json({ error: 'Validation failed', details: errors });
      }
      next(error);
    }
  };
};

// Auth schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.enum(['student', 'teacher']).optional(),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

// User profile schemas
export const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  phone: z.string().optional(),
  bio: z.string().max(1000, 'Bio must be less than 1000 characters').optional(),
  location: z.string().optional(),
  languages: z.array(z.string()).optional(),
  dateOfBirth: z.string().datetime().optional(),
});

// Teacher profile schemas
export const teacherProfileSchema = z.object({
  subjects: z.array(z.string()).min(1, 'At least one subject is required'),
  hourlyRate: z.number().min(0, 'Hourly rate must be positive'),
  experience: z.object({
    years: z.number().min(0, 'Experience years must be positive'),
    description: z.string().max(2000, 'Description must be less than 2000 characters'),
    certifications: z.array(z.object({
      name: z.string(),
      issuer: z.string(),
      year: z.number(),
      documentUrl: z.string().url().optional(),
    })).optional(),
  }),
  education: z.array(z.object({
    degree: z.string(),
    institution: z.string(),
    year: z.number(),
    field: z.string(),
  })).optional(),
});

export const availabilitySchema = z.object({
  timezone: z.string().optional(),
  schedule: z.record(z.object({
    available: z.boolean(),
    slots: z.array(z.object({
      startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
      endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    })),
  })),
});

// Student profile schemas
export const studentProfileSchema = z.object({
  learningProfile: z.object({
    goals: z.array(z.string()).optional(),
    currentLevel: z.enum(['beginner', 'elementary', 'intermediate', 'upper-intermediate', 'advanced', 'proficient']).optional(),
    preferredSubjects: z.array(z.string()).optional(),
    learningStyle: z.enum(['visual', 'auditory', 'kinesthetic', 'mixed']).optional(),
    targetLevel: z.enum(['elementary', 'intermediate', 'upper-intermediate', 'advanced', 'proficient', 'native']).optional(),
    timeline: z.enum(['1-3 months', '3-6 months', '6-12 months', '1+ years']).optional(),
  }).optional(),
  preferences: z.object({
    teacherGender: z.enum(['any', 'male', 'female']).optional(),
    maxBudget: z.number().min(0).optional(),
    preferredLanguages: z.array(z.string()).optional(),
    lessonDuration: z.array(z.number()).optional(),
    timeSlots: z.array(z.string()).optional(),
  }).optional(),
});

// Lesson schemas
export const bookLessonSchema = z.object({
  teacherId: z.string().min(1, 'Teacher ID is required'),
  subject: z.string().min(1, 'Subject is required'),
  scheduledAt: z.string().datetime('Invalid date format'),
  duration: z.number().min(15, 'Minimum lesson duration is 15 minutes').max(240, 'Maximum lesson duration is 240 minutes'),
  type: z.enum(['regular', 'trial', 'group']).optional(),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

export const updateLessonSchema = z.object({
  scheduledAt: z.string().datetime().optional(),
  duration: z.number().min(15).max(240).optional(),
  status: z.enum(['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show']).optional(),
  teacherNotes: z.string().max(2000).optional(),
  studentNotes: z.string().max(2000).optional(),
  objectives: z.array(z.string()).optional(),
  homework: z.string().max(1000).optional(),
});

export const rescheduleSchema = z.object({
  newDateTime: z.string().datetime('Invalid date format'),
  reason: z.string().max(500, 'Reason must be less than 500 characters').optional(),
});

export const cancelLessonSchema = z.object({
  reason: z.string().max(500, 'Reason must be less than 500 characters').optional(),
});

// Review schemas
export const createReviewSchema = z.object({
  lessonId: z.string().min(1, 'Lesson ID is required'),
  ratings: z.object({
    overall: z.number().min(1).max(5),
    teachingQuality: z.number().min(1).max(5),
    communication: z.number().min(1).max(5),
    punctuality: z.number().min(1).max(5),
    preparation: z.number().min(1).max(5),
  }),
  reviewText: z.string().min(10, 'Review must be at least 10 characters').max(2000, 'Review must be less than 2000 characters'),
  isAnonymous: z.boolean().optional(),
  wouldRecommend: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

export const respondToReviewSchema = z.object({
  responseText: z.string().min(1, 'Response text is required').max(1000, 'Response must be less than 1000 characters'),
});

// Message schemas
export const sendMessageSchema = z.object({
  receiverId: z.string().min(1, 'Receiver ID is required'),
  content: z.object({
    type: z.enum(['text', 'image', 'file', 'audio', 'video']),
    text: z.string().max(5000).optional(),
    fileUrl: z.string().url().optional(),
    fileName: z.string().optional(),
  }),
  replyTo: z.string().optional(),
});

// Search and filter schemas
export const searchTeachersSchema = z.object({
  query: z.string().optional(),
  subjects: z.array(z.string()).optional(),
  minRate: z.number().min(0).optional(),
  maxRate: z.number().min(0).optional(),
  minRating: z.number().min(0).max(5).optional(),
  location: z.string().optional(),
  availability: z.string().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  sortBy: z.enum(['rating', 'price', 'experience', 'newest']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const paginationSchema = z.object({
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});
