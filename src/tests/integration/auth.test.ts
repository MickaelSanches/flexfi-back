import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../app';
import User from '../../models/User';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User'
        });
      
      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.user).toHaveProperty('email', 'test@example.com');
      expect(res.body.data).toHaveProperty('token');
    });
    
    it('should return 400 if email or password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'Test',
          lastName: 'User'
        });
      
      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toBe('Email and password are required');
    });
    
    it('should return 409 if user already exists', async () => {
      // Créer un utilisateur d'abord
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'existing@example.com',
          password: 'password123'
        });
      
      // Essayer de créer un utilisateur avec le même email
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'existing@example.com',
          password: 'password456'
        });
      
      expect(res.status).toBe(409);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('already exists');
    });
  });
  
  describe('POST /api/auth/login', () => {
    it('should login an existing user', async () => {
      // Créer un utilisateur d'abord
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'login@example.com',
          password: 'password123'
        });
      
      // Tester la connexion
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123'
        });
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.user).toHaveProperty('email', 'login@example.com');
      expect(res.body.data).toHaveProperty('token');
    });
    
    it('should return 401 with invalid credentials', async () => {
      // Créer un utilisateur d'abord
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'login@example.com',
          password: 'password123'
        });
      
      // Essayer de se connecter avec un mauvais mot de passe
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword'
        });
      
      expect(res.status).toBe(401);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('Invalid credentials');
    });
  });
  
  describe('GET /api/auth/me', () => {
    it('should get current user if authenticated', async () => {
      // Créer un utilisateur et récupérer le token
      const registerRes = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'me@example.com',
          password: 'password123'
        });
      
      const token = registerRes.body.data.token;
      
      // Tester la route /me
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.user).toHaveProperty('email', 'me@example.com');
    });
    
    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .get('/api/auth/me');
      
      expect(res.status).toBe(401);
      expect(res.body.status).toBe('error');
    });
  });
});