import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as AppleStrategy } from 'passport-apple';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { authConfig } from './config/auth';
import routes from './routes';
import { errorHandler, notFound } from './middlewares/errorMiddleware';
import path from 'path';

// Initialiser l'application Express
const app: Express = express();

// Middlewares de base
app.use(helmet()); // Sécurité
app.use(cors()); // CORS
app.use(morgan('dev')); // Logging
app.use(express.json({ limit: '10mb' })); // Parsing JSON with increased limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Configuration de Passport
passport.use(
  new GoogleStrategy(
    {
      clientID: authConfig.google.clientID,
      clientSecret: authConfig.google.clientSecret,
      callbackURL: authConfig.google.callbackURL,
    },
    (_accessToken, _refreshToken, profile, done) => {
      // L'authentification est gérée par le contrôleur
      done(null, profile);
    }
  )
);

passport.use(
  new TwitterStrategy(
    {
      consumerKey: authConfig.twitter.consumerKey,
      consumerSecret: authConfig.twitter.consumerSecret,
      callbackURL: authConfig.twitter.callbackURL,
    },
    (_token: string, _tokenSecret: string, profile: any, done: (err: Error | null, user?: any) => void) => {
      // L'authentification est gérée par le contrôleur
      done(null, profile);
    }
  )
);

app.use(passport.initialize());

// Routes API
app.use('/api', routes);

// Route de base
app.get('/', (_req, res) => {
  res.json({ message: 'FlexFi API is running' });
});

// Middleware pour les routes non trouvées
app.use(notFound);

// Middleware de gestion des erreurs
app.use(errorHandler);

export default app;