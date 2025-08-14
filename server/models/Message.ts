import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  conversationId: string;
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  content: {
    type: 'text' | 'image' | 'file' | 'audio' | 'video';
    text?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
  };
  readAt?: Date;
  editedAt?: Date;
  originalContent?: string;
  isDeleted: boolean;
  deletedAt?: Date;
  replyTo?: mongoose.Types.ObjectId;
  metadata: {
    platform?: string;
    ipAddress?: string;
    deviceInfo?: string;
  };
}

export interface IConversation extends Document {
  participants: {
    userId: mongoose.Types.ObjectId;
    role: 'student' | 'teacher';
    lastSeenAt: Date;
    isTyping: boolean;
  }[];
  type: 'direct' | 'lesson' | 'support';
  lessonId?: mongoose.Types.ObjectId;
  lastMessage: {
    content: string;
    senderId: mongoose.Types.ObjectId;
    sentAt: Date;
  };
  isActive: boolean;
  metadata: {
    subject?: string;
    priority?: 'low' | 'normal' | 'high';
    tags?: string[];
  };
}

const messageSchema = new Schema<IMessage>({
  conversationId: {
    type: String,
    required: true,
    index: true,
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: {
      type: String,
      enum: ['text', 'image', 'file', 'audio', 'video'],
      required: true,
    },
    text: {
      type: String,
      maxlength: 5000,
      trim: true,
    },
    fileUrl: String,
    fileName: String,
    fileSize: Number,
    mimeType: String,
  },
  readAt: Date,
  editedAt: Date,
  originalContent: String,
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: Date,
  replyTo: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
  },
  metadata: {
    platform: String,
    ipAddress: String,
    deviceInfo: String,
  },
}, {
  timestamps: true,
});

const conversationSchema = new Schema<IConversation>({
  participants: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['student', 'teacher'],
      required: true,
    },
    lastSeenAt: {
      type: Date,
      default: Date.now,
    },
    isTyping: {
      type: Boolean,
      default: false,
    },
  }],
  type: {
    type: String,
    enum: ['direct', 'lesson', 'support'],
    default: 'direct',
  },
  lessonId: {
    type: Schema.Types.ObjectId,
    ref: 'Lesson',
  },
  lastMessage: {
    content: String,
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    sentAt: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  metadata: {
    subject: String,
    priority: {
      type: String,
      enum: ['low', 'normal', 'high'],
      default: 'normal',
    },
    tags: [String],
  },
}, {
  timestamps: true,
});

// Indexes
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1, createdAt: -1 });
messageSchema.index({ receiverId: 1, readAt: 1 });

conversationSchema.index({ 'participants.userId': 1 });
conversationSchema.index({ type: 1 });
conversationSchema.index({ lessonId: 1 });
conversationSchema.index({ 'lastMessage.sentAt': -1 });

// Compound index for efficient participant queries
conversationSchema.index({
  'participants.userId': 1,
  'lastMessage.sentAt': -1,
});

export const Message = mongoose.model<IMessage>('Message', messageSchema);
export const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema);
