import mongoose, { Schema, Document } from 'mongoose';

export enum NotificationType {
  // Authentication notifications
  ACCOUNT_CREATED = 'account_created',
  LOGIN_NEW_DEVICE = 'login_new_device',
  PASSWORD_CHANGED = 'password_changed',
  
  // Wallet notifications
  WALLET_CREATED = 'wallet_created',
  WALLET_CONNECTED = 'wallet_connected',
  DELEGATION_APPROVED = 'delegation_approved',
  DELEGATION_EXPIRED = 'delegation_expired',
  LOW_BALANCE = 'low_balance',
  TRANSACTION_CONFIRMED = 'transaction_confirmed',
  
  // KYC notifications
  KYC_SUBMITTED = 'kyc_submitted',
  KYC_APPROVED = 'kyc_approved',
  KYC_REJECTED = 'kyc_rejected',
  KYC_EXPIRING = 'kyc_expiring',
  
  // Card notifications
  CARD_SELECTED = 'card_selected',
  CARD_APPROVED = 'card_approved',
  CARD_REJECTED = 'card_rejected',
  CARD_ACTIVATED = 'card_activated',
  CARD_LIMIT_CHANGED = 'card_limit_changed',
  
  // Transaction notifications
  TRANSACTION_PENDING = 'transaction_pending',
  TRANSACTION_COMPLETED = 'transaction_completed',
  TRANSACTION_FAILED = 'transaction_failed',
  
  // Repayment notifications
  PAYMENT_UPCOMING = 'payment_upcoming',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',
  PAYMENT_LATE = 'payment_late'
}

export interface INotificationData {
  [key: string]: any;
}

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: NotificationType;
  message: string;
  data?: INotificationData;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    type: { 
      type: String, 
      required: true, 
      enum: Object.values(NotificationType)
    },
    message: { 
      type: String, 
      required: true 
    },
    data: { 
      type: Schema.Types.Mixed 
    },
    read: { 
      type: Boolean, 
      default: false 
    },
  },
  { timestamps: true }
);

// Index for faster queries on userId and read status
NotificationSchema.index({ userId: 1, read: 1 });
NotificationSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<INotification>('Notification', NotificationSchema); 