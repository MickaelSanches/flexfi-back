import mongoose, { Document, Schema } from "mongoose";

// Interface for the LOI data from the form
export interface ILOI extends Document {
  fullName: string;
  company: string;
  email: string;
  country: string;
  sector: string;
  comments?: string;
  signature: string; // base64 PNG
  pdfUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for the LOI model
const LOISchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    company: { type: String, required: true },
    email: { type: String, required: true },
    country: { type: String, required: true },
    sector: { type: String, required: true },
    comments: { type: String, required: false },
    signature: { type: String, required: true }, // base64 PNG
    pdfUrl: { type: String, required: true },
  },
  { timestamps: true }
);

// Export the model
const LOI = mongoose.model<ILOI>("LOI", LOISchema);

export { LOI, LOISchema }; 