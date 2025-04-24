import { Router } from 'express';
import authController from '../controllers/authController';
import { authenticate } from '../middlewares/authMiddleware';
import passport from 'passport';

const router = Router();

// Routes pour l'authentification par email
router.post('/register', authController.register);
router.post('/login', authController.login);

// Routes pour l'authentification par OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), authController.googleCallback);

router.get('/apple', passport.authenticate('apple'));
router.get('/apple/callback', passport.authenticate('apple', { session: false }), authController.appleCallback);

router.get('/twitter', passport.authenticate('twitter'));
router.get('/twitter/callback', passport.authenticate('twitter', { session: false }), authController.twitterCallback);

// Route pour récupérer l'utilisateur actuel
router.get('/me', authenticate, authController.getCurrentUser);

export default router;