import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  studentId: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
  lessonId: mongoose.Types.ObjectId;
  ratings: {
    overall: number;
    teachingQuality: number;
    communication: number;
    punctuality: number;
    preparation: number;
  };
  reviewText: string;
  isAnonymous: boolean;
  wouldRecommend: boolean;
  tags: string[];
  photos: string[];
  helpfulVotes: {
    userId: mongoose.Types.ObjectId;
    isHelpful: boolean;
  }[];
  teacherResponse: {
    text: string;
    respondedAt: Date;
  };
  status: 'pending' | 'approved' | 'rejected' | 'hidden';
  moderationNotes?: string;
  reportedBy: {
    userId: mongoose.Types.ObjectId;
    reason: string;
    reportedAt: Date;
  }[];
  editHistory: {
    editedAt: Date;
    previousText: string;
    reason: string;
  }[];
}

const reviewSchema = new Schema<IReview>({
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
  lessonId: {
    type: Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true,
    unique: true, // One review per lesson
  },
  ratings: {
    overall: { type: Number, required: true, min: 1, max: 5 },
    teachingQuality: { type: Number, required: true, min: 1, max: 5 },
    communication: { type: Number, required: true, min: 1, max: 5 },
    punctuality: { type: Number, required: true, min: 1, max: 5 },
    preparation: { type: Number, required: true, min: 1, max: 5 },
  },
  reviewText: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 2000,
    trim: true,
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  wouldRecommend: {
    type: Boolean,
    default: true,
  },
  tags: [{
    type: String,
    trim: true,
    enum: [
      'excellent-teacher',
      'patient',
      'knowledgeable',
      'well-prepared',
      'punctual',
      'engaging',
      'helpful',
      'professional',
      'friendly',
      'flexible',
      'experienced',
      'motivating',
      'clear-explanations',
      'good-materials',
      'interactive',
    ],
  }],
  photos: [{
    type: String,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
      },
      message: 'Invalid photo URL format',
    },
  }],
  helpfulVotes: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isHelpful: {
      type: Boolean,
      required: true,
    },
  }],
  teacherResponse: {
    text: {
      type: String,
      maxlength: 1000,
      trim: true,
    },
    respondedAt: Date,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'hidden'],
    default: 'pending',
  },
  moderationNotes: {
    type: String,
    maxlength: 500,
  },
  reportedBy: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reason: {
      type: String,
      required: true,
      enum: [
        'inappropriate-content',
        'false-information',
        'spam',
        'harassment',
        'offensive-language',
        'other',
      ],
    },
    reportedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  editHistory: [{
    editedAt: {
      type: Date,
      default: Date.now,
    },
    previousText: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      maxlength: 200,
    },
  }],
}, {
  timestamps: true,
});

// Indexes
reviewSchema.index({ teacherId: 1, status: 1 });
reviewSchema.index({ studentId: 1 });
reviewSchema.index({ lessonId: 1 });
reviewSchema.index({ 'ratings.overall': -1 });
reviewSchema.index({ createdAt: -1 });

// Virtual for helpful votes count
reviewSchema.virtual('helpfulVotesCount').get(function() {
  return this.helpfulVotes.filter(vote => vote.isHelpful).length;
});

// Virtual for unhelpful votes count
reviewSchema.virtual('unhelpfulVotesCount').get(function() {
  return this.helpfulVotes.filter(vote => !vote.isHelpful).length;
});

// Virtual for average rating calculation
reviewSchema.virtual('averageRating').get(function() {
  const { teachingQuality, communication, punctuality, preparation } = this.ratings;
  return (teachingQuality + communication + punctuality + preparation) / 4;
});

export default mongoose.model<IReview>('Review', reviewSchema);
