import mongoose, { Schema, Document } from 'mongoose';

export interface ICard extends Document {
  userId: mongoose.Types.ObjectId;
  cardType: 'standard' | 'gold' | 'platinum';
  status: 'pending' | 'active' | 'blocked';
  virtualCardDetails?: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  };
  limits: {
    daily: number;
    monthly: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CardSchema: Schema = new Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    cardType: { 
      type: String, 
      required: true, 
      enum: ['standard', 'gold', 'platinum'] 
    },
    status: { 
      type: String, 
      required: true, 
      enum: ['pending', 'active', 'blocked'],
      default: 'pending'
    },
    virtualCardDetails: {
      cardNumber: { type: String },
      expiryDate: { type: String },
      cvv: { type: String },
    },
    limits: {
      daily: { type: Number, required: true },
      monthly: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICard>('Card', CardSchema);