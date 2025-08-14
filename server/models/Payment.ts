import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  studentId: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
  lessonId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  paymentMethod: {
    type: 'card' | 'bank' | 'wallet' | 'cash';
    provider: string;
    last4?: string;
    cardType?: string;
  };
  transactionId: string;
  externalTransactionId?: string;
  fees: {
    platformFee: number;
    processingFee: number;
    total: number;
  };
  teacherEarnings: {
    amount: number;
    commission: number;
    netAmount: number;
  };
  refund: {
    amount?: number;
    reason?: string;
    processedAt?: Date;
    refundTransactionId?: string;
  };
  metadata: {
    ipAddress?: string;
    userAgent?: string;
    paymentGateway?: string;
    gatewayResponse?: any;
  };
  processedAt?: Date;
  failureReason?: string;
}

const paymentSchema = new Schema<IPayment>({
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
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    required: true,
    default: 'UZS',
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'],
    default: 'pending',
  },
  paymentMethod: {
    type: {
      type: String,
      enum: ['card', 'bank', 'wallet', 'cash'],
      required: true,
    },
    provider: {
      type: String,
      required: true,
    },
    last4: String,
    cardType: {
      type: String,
      enum: ['visa', 'mastercard', 'uzcard', 'humo'],
    },
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  externalTransactionId: String,
  fees: {
    platformFee: { type: Number, default: 0 },
    processingFee: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  teacherEarnings: {
    amount: { type: Number, required: true },
    commission: { type: Number, default: 15 }, // percentage
    netAmount: { type: Number, required: true },
  },
  refund: {
    amount: Number,
    reason: String,
    processedAt: Date,
    refundTransactionId: String,
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    paymentGateway: String,
    gatewayResponse: Schema.Types.Mixed,
  },
  processedAt: Date,
  failureReason: String,
}, {
  timestamps: true,
});

// Indexes
paymentSchema.index({ studentId: 1, createdAt: -1 });
paymentSchema.index({ teacherId: 1, createdAt: -1 });
paymentSchema.index({ lessonId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ createdAt: -1 });

// Pre-save middleware to calculate teacher earnings
paymentSchema.pre('save', function(next) {
  if (this.isModified('amount') || this.isModified('teacherEarnings.commission')) {
    const commission = this.teacherEarnings.commission || 15;
    const commissionAmount = (this.amount * commission) / 100;
    this.teacherEarnings.amount = this.amount - commissionAmount;
    this.teacherEarnings.netAmount = this.teacherEarnings.amount;
  }
  next();
});

export default mongoose.model<IPayment>('Payment', paymentSchema);
