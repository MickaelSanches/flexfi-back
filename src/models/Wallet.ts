import mongoose, { Schema, Document } from 'mongoose';

export interface IWallet extends Document {
  userId: mongoose.Types.ObjectId;
  publicKey: string;
  encryptedPrivateKey?: string; // Uniquement pour les wallets créés par le service
  type: 'connected' | 'created';
  hasDelegation: boolean;
  delegationExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WalletSchema: Schema = new Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    publicKey: { type: String, required: true, unique: true },
    encryptedPrivateKey: { type: String },
    type: { 
      type: String, 
      required: true, 
      enum: ['connected', 'created'],
    },
    hasDelegation: { type: Boolean, default: false },
    delegationExpiry: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IWallet>('Wallet', WalletSchema);