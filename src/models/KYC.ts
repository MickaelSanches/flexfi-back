import mongoose, { Schema, Document } from 'mongoose';

export interface IKYC extends Document {
  userId: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  providerReference: string; // Référence chez le fournisseur KYC (Kulipa)
  submissionData: any; // Données soumises pour le KYC
  responseData: any; // Réponse du fournisseur KYC
  createdAt: Date;
  updatedAt: Date;
}

const KYCSchema: Schema = new Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      unique: true
    },
    status: { 
      type: String, 
      required: true, 
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    providerReference: { type: String },
    submissionData: { type: Schema.Types.Mixed },
    responseData: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.model<IKYC>('KYC', KYCSchema);