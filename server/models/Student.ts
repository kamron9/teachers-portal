import mongoose, { Document, Schema } from 'mongoose';

export interface IStudent extends Document {
  userId: mongoose.Types.ObjectId;
  learningProfile: {
    goals: string[];
    currentLevel: string;
    preferredSubjects: string[];
    learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
    targetLevel: string;
    timeline: string;
  };
  preferences: {
    teacherGender: 'any' | 'male' | 'female';
    maxBudget: number;
    currency: string;
    preferredLanguages: string[];
    lessonDuration: number[];
    timeSlots: string[];
  };
  statistics: {
    totalLessons: number;
    totalSpent: number;
    favoriteTeachers: mongoose.Types.ObjectId[];
    averageRatingGiven: number;
    hoursLearned: number;
  };
  paymentMethods: {
    type: 'card' | 'bank' | 'wallet';
    last4?: string;
    provider: string;
    isDefault: boolean;
    isVerified: boolean;
  }[];
  subscription: {
    type: 'basic' | 'premium' | 'enterprise';
    status: 'active' | 'inactive' | 'expired';
    expiresAt?: Date;
    features: string[];
  };
}

const studentSchema = new Schema<IStudent>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  learningProfile: {
    goals: [{
      type: String,
      trim: true,
    }],
    currentLevel: {
      type: String,
      enum: ['beginner', 'elementary', 'intermediate', 'upper-intermediate', 'advanced', 'proficient'],
      default: 'beginner',
    },
    preferredSubjects: [{
      type: String,
      trim: true,
    }],
    learningStyle: {
      type: String,
      enum: ['visual', 'auditory', 'kinesthetic', 'mixed'],
      default: 'mixed',
    },
    targetLevel: {
      type: String,
      enum: ['elementary', 'intermediate', 'upper-intermediate', 'advanced', 'proficient', 'native'],
    },
    timeline: {
      type: String,
      enum: ['1-3 months', '3-6 months', '6-12 months', '1+ years'],
    },
  },
  preferences: {
    teacherGender: {
      type: String,
      enum: ['any', 'male', 'female'],
      default: 'any',
    },
    maxBudget: {
      type: Number,
      min: 0,
    },
    currency: {
      type: String,
      default: 'UZS',
    },
    preferredLanguages: [{
      type: String,
      trim: true,
    }],
    lessonDuration: [{
      type: Number,
      enum: [30, 45, 60, 90, 120],
    }],
    timeSlots: [{
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'night'],
    }],
  },
  statistics: {
    totalLessons: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    favoriteTeachers: [{
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
    }],
    averageRatingGiven: { type: Number, default: 0 },
    hoursLearned: { type: Number, default: 0 },
  },
  paymentMethods: [{
    type: {
      type: String,
      enum: ['card', 'bank', 'wallet'],
      required: true,
    },
    last4: String,
    provider: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
  }],
  subscription: {
    type: {
      type: String,
      enum: ['basic', 'premium', 'enterprise'],
      default: 'basic',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'expired'],
      default: 'active',
    },
    expiresAt: Date,
    features: [{
      type: String,
    }],
  },
}, {
  timestamps: true,
});

// Indexes
studentSchema.index({ userId: 1 });
studentSchema.index({ 'learningProfile.preferredSubjects': 1 });
studentSchema.index({ 'preferences.maxBudget': 1 });
studentSchema.index({ 'statistics.totalLessons': -1 });

export default mongoose.model<IStudent>('Student', studentSchema);
