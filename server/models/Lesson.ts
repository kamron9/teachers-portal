import mongoose, { Document, Schema } from 'mongoose';

export interface ILesson extends Document {
  studentId: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
  subject: string;
  scheduledAt: Date;
  duration: number; // in minutes
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  type: 'regular' | 'trial' | 'group';
  price: {
    amount: number;
    currency: string;
    discountApplied?: number;
  };
  meetingInfo: {
    platform: 'zoom' | 'google-meet' | 'builtin' | 'other';
    roomId?: string;
    meetingUrl?: string;
    password?: string;
  };
  materials: {
    type: 'pdf' | 'image' | 'video' | 'audio' | 'link';
    name: string;
    url: string;
    uploadedBy: 'student' | 'teacher';
    uploadedAt: Date;
  }[];
  notes: {
    teacherNotes?: string;
    studentNotes?: string;
    objectives?: string[];
    homework?: string;
  };
  attendance: {
    studentJoinedAt?: Date;
    teacherJoinedAt?: Date;
    studentLeftAt?: Date;
    teacherLeftAt?: Date;
    actualDuration?: number;
  };
  cancellation: {
    cancelledBy?: 'student' | 'teacher' | 'admin';
    reason?: string;
    cancelledAt?: Date;
    refundAmount?: number;
  };
  reschedule: {
    requestedBy?: 'student' | 'teacher';
    requestedAt?: Date;
    newDateTime?: Date;
    reason?: string;
    status?: 'pending' | 'approved' | 'rejected';
  };
}

const lessonSchema = new Schema<ILesson>({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  teacherId: {
    type: Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  scheduledAt: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
    min: 15,
    max: 240,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'pending',
  },
  type: {
    type: String,
    enum: ['regular', 'trial', 'group'],
    default: 'regular',
  },
  price: {
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'UZS' },
    discountApplied: { type: Number, min: 0, max: 100 },
  },
  meetingInfo: {
    platform: {
      type: String,
      enum: ['zoom', 'google-meet', 'builtin', 'other'],
      default: 'builtin',
    },
    roomId: String,
    meetingUrl: String,
    password: String,
  },
  materials: [{
    type: {
      type: String,
      enum: ['pdf', 'image', 'video', 'audio', 'link'],
      required: true,
    },
    name: { type: String, required: true },
    url: { type: String, required: true },
    uploadedBy: {
      type: String,
      enum: ['student', 'teacher'],
      required: true,
    },
    uploadedAt: { type: Date, default: Date.now },
  }],
  notes: {
    teacherNotes: { type: String, maxlength: 2000 },
    studentNotes: { type: String, maxlength: 2000 },
    objectives: [{ type: String, trim: true }],
    homework: { type: String, maxlength: 1000 },
  },
  attendance: {
    studentJoinedAt: Date,
    teacherJoinedAt: Date,
    studentLeftAt: Date,
    teacherLeftAt: Date,
    actualDuration: Number,
  },
  cancellation: {
    cancelledBy: {
      type: String,
      enum: ['student', 'teacher', 'admin'],
    },
    reason: { type: String, maxlength: 500 },
    cancelledAt: Date,
    refundAmount: { type: Number, min: 0 },
  },
  reschedule: {
    requestedBy: {
      type: String,
      enum: ['student', 'teacher'],
    },
    requestedAt: Date,
    newDateTime: Date,
    reason: { type: String, maxlength: 500 },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
    },
  },
}, {
  timestamps: true,
});

// Indexes
lessonSchema.index({ studentId: 1, scheduledAt: -1 });
lessonSchema.index({ teacherId: 1, scheduledAt: -1 });
lessonSchema.index({ status: 1 });
lessonSchema.index({ scheduledAt: 1 });
lessonSchema.index({ subject: 1 });

// Virtual for lesson duration in hours
lessonSchema.virtual('durationHours').get(function() {
  return this.duration / 60;
});

export default mongoose.model<ILesson>('Lesson', lessonSchema);
