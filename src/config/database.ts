// import mongoose from 'mongoose';
// import dotenv from 'dotenv';

// // Charger les variables d'environnement
// dotenv.config();

// // Récupérer l'URI de MongoDB
// const MONGODB_URI = process.env.MONGODB_URI;

// // Vérifier si l'URI est défini
// if (!MONGODB_URI) {
//   console.error('MONGODB_URI is not defined in environment variables');
//   process.exit(1);
// }

// export const connectDatabase = async (): Promise<void> => {
//   try {
//     console.log('Connecting to MongoDB Atlas...');
//     await mongoose.connect(MONGODB_URI);
//     console.log('Connected to MongoDB Atlas');
//   } catch (error) {
//     console.error('MongoDB connection error:', error);
//     process.exit(1);
//   }
// };

import mongoose from 'mongoose';

// Get MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

export const connectDatabase = async (): Promise<void> => {
  try {
    // In test environment, connect to the test database
    if (process.env.NODE_ENV === 'test') {
      console.log('Connecting to test database...');
      // If the URI is 'memory', we're using MongoMemoryServer which is initialized in the test
      if (MONGODB_URI !== 'memory') {
        await mongoose.connect(MONGODB_URI || 'mongodb://localhost:27017/flexfi_test');
        console.log('Connected to test database');
      } else {
        console.log('Using in-memory database from MongoMemoryServer');
        // Connection is managed by the test itself
      }
    } else {
      // In production/development, connect to Atlas
      console.log('Connecting to MongoDB Atlas...');
      
      // Default to Atlas URI if MONGODB_URI is not set
      const uri = MONGODB_URI || 'mongodb+srv://henrilbhlb:BabyFace33@flexfidev.m4hdwkn.mongodb.net/flexfi?retryWrites=true&w=majority';
      
      await mongoose.connect(uri);
      console.log('Connected to MongoDB Atlas successfully!');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    
    // Don't exit in test environment, let the test handle it
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    } else {
      throw error;
    }
  }
};