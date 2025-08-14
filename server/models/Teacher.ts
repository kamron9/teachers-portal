import mongoose, { Document, Schema } from 'mongoose';

export interface ITeacher extends Document {
  userId: mongoose.Types.ObjectId;
  isApproved: boolean;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  subjects: string[];
  hourlyRate: number;
  currency: string;
  experience: {
    years: number;
    description: string;
    certifications: {
      name: string;
      issuer: string;
      year: number;
      documentUrl?: string;
    }[];
  };
  education: {
    degree: string;
    institution: string;
    year: number;
    field: string;
  }[];
  availability: {
    timezone: string;
    schedule: {
      [key: string]: { // Monday, Tuesday, etc.
        available: boolean;
        slots: {
          startTime: string; // "09:00"
          endTime: string;   // "17:00"
        }[];
      };
    };
  };
  statistics: {
    totalLessons: number;
    totalStudents: number;
    averageRating: number;
    totalEarnings: number;
    responseRate: number;
  };
  bankInfo: {
    accountNumber?: string;
    bankName?: string;
    accountHolderName?: string;
    isVerified: boolean;
  };
  documents: {
    type: 'id' | 'diploma' | 'certificate' | 'other';
    url: string;
    status: 'pending' | 'approved' | 'rejected';
    uploadedAt: Date;
  }[];
  settings: {
    autoAcceptBookings: boolean;
    advanceBookingDays: number;
    cancellationPolicy: string;
  };
}

const teacherSchema = new Schema<ITeacher>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  subjects: [{
    type: String,
    required: true,
  }],
  hourlyRate: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: 'UZS',
  },
  experience: {
    years: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      maxlength: 2000,
    },
    certifications: [{
      name: { type: String, required: true },
      issuer: { type: String, required: true },
      year: { type: Number, required: true },
      documentUrl: String,
    }],
  },
  education: [{
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    year: { type: Number, required: true },
    field: { type: String, required: true },
  }],
  availability: {
    timezone: {
      type: String,
      default: 'Asia/Tashkent',
    },
    schedule: {
      type: Map,
      of: {
        available: { type: Boolean, default: false },
        slots: [{
          startTime: { type: String, required: true },
          endTime: { type: String, required: true },
        }],
      },
      default: () => ({
        monday: { available: false, slots: [] },
        tuesday: { available: false, slots: [] },
        wednesday: { available: false, slots: [] },
        thursday: { available: false, slots: [] },
        friday: { available: false, slots: [] },
        saturday: { available: false, slots: [] },
        sunday: { available: false, slots: [] },
      }),
    },
  },
  statistics: {
    totalLessons: { type: Number, default: 0 },
    totalStudents: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    responseRate: { type: Number, default: 100 },
  },
  bankInfo: {
    accountNumber: String,
    bankName: String,
    accountHolderName: String,
    isVerified: { type: Boolean, default: false },
  },
  documents: [{
    type: {
      type: String,
      enum: ['id', 'diploma', 'certificate', 'other'],
      required: true,
    },
    url: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    uploadedAt: { type: Date, default: Date.now },
  }],
  settings: {
    autoAcceptBookings: { type: Boolean, default: false },
    advanceBookingDays: { type: Number, default: 14 },
    cancellationPolicy: { type: String, default: '24 hours' },
  },
}, {
  timestamps: true,
});

// Indexes
teacherSchema.index({ userId: 1 });
teacherSchema.index({ subjects: 1 });
teacherSchema.index({ hourlyRate: 1 });
teacherSchema.index({ isApproved: 1 });
teacherSchema.index({ 'statistics.averageRating': -1 });

export default mongoose.model<ITeacher>('Teacher', teacherSchema);
