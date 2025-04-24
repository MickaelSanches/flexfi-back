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

// Initialiser l'application Express
const app: Express = express();

// Middlewares de base
app.use(helmet()); // Sécurité
app.use(cors()); // CORS
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parsing JSON

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
    (_token, _tokenSecret, profile, done) => {
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