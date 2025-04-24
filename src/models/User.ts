import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IWallet {
  publicKey: string;
  type: 'connected' | 'created';
  hasDelegation: boolean;
  delegationExpiry?: Date;
}

export interface IUser extends Document {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  authMethod: 'email' | 'google' | 'apple' | 'twitter';
  googleId?: string;
  appleId?: string;
  twitterId?: string;
  wallets: IWallet[];
  kycStatus: 'none' | 'pending' | 'approved' | 'rejected';
  kycId?: string;
  selectedCard?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    authMethod: { 
      type: String, 
      required: true, 
      enum: ['email', 'google', 'apple', 'twitter'],
      default: 'email'
    },
    googleId: { type: String },
    appleId: { type: String },
    twitterId: { type: String },
    wallets: [
      {
        publicKey: { type: String, required: true },
        type: { 
          type: String, 
          required: true, 
          enum: ['connected', 'created'],
        },
        hasDelegation: { type: Boolean, default: false },
        delegationExpiry: { type: Date },
      }
    ],
    kycStatus: { 
      type: String, 
      required: true, 
      enum: ['none', 'pending', 'approved', 'rejected'],
      default: 'none'
    },
    kycId: { type: String },
    selectedCard: { type: String, enum: ['standard', 'gold', 'platinum'] },
  },
  { timestamps: true }
);

// Middleware pour hasher le mot de passe avant l'enregistrement
UserSchema.pre<IUser>('save', async function(next) {
  if (this.isModified('password') && this.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error: any) {
      next(error);
    }
  } else {
    next();
  }
});

// Méthode pour comparer les mots de passe
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);