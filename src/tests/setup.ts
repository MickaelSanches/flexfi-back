// tests/setup.ts
import dotenv from 'dotenv';

// Charger les variables d'environnement pour les tests
dotenv.config({ path: '.env.test' });

// Augmenter le timeout pour les tests qui peuvent prendre plus de temps
jest.setTimeout(30000);