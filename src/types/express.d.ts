import { Request } from 'express';
import { Document } from 'mongoose';

// Extend the User interface to include required properties
export interface UserDocument extends Document {
  _id: any;
  id: string;
  email: string;
  authMethod: string;
  [key: string]: any;
}

// Extend Express Request type to properly type the user property
declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}