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

// Forcer explicitement l'URI Atlas
const ATLAS_URI = 'mongodb+srv://henrilbhlb:BabyFace33@flexfidev.m4hdwkn.mongodb.net/flexfi?retryWrites=true&w=majority';

export const connectDatabase = async (): Promise<void> => {
  try {
    // Désactiver l'utilisation de localhost
    if (process.env.NODE_ENV !== 'test') {
      console.log('Connecting to MongoDB Atlas directly...');
      await mongoose.connect(ATLAS_URI);
      console.log('Connected to MongoDB Atlas successfully!');
    } else {
      // Pour les tests uniquement
      await mongoose.connect('mongodb://localhost:27017/flexfi-test');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.error('Failed to connect to', ATLAS_URI);
    process.exit(1);
  }
};