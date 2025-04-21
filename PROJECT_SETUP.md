# FlexFi Backend - Project Setup Guide

This document provides an overview of the project setup, dependencies, and module organization for the FlexFi backend.

## Project Structure

The backend is organized using a clean architecture pattern with the following main directories:

- **controllers/** - API endpoint handlers
- **services/** - Business logic
- **routes/** - API route definitions
- **repositories/** - Database access layer
- **middlewares/** - Authentication, validation, logging
- **utils/** - Helper functions
- **models/** - Database entity models
- **config/** - Configuration settings
- **types/** - TypeScript type definitions
- **migrations/** - Database migration files

## Core Dependencies

### Base Framework
- **Express** - Web server framework
- **TypeScript** - Type-safe JavaScript
- **TypeORM** - Object-Relational Mapping for PostgreSQL

### Authentication & Security
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT implementation
- **helmet** - Security headers
- **cors** - Cross-Origin Resource Sharing
- **express-rate-limit** - API rate limiting
- **crypto-js** - Encryption for wallet keys

### Solana Integration
- **@solana/web3.js** - Solana blockchain interaction

### Validation & Data Processing
- **joi** - Request validation
- **uuid** - Unique ID generation

### Communication & Notifications
- **nodemailer** - Email sending
- **bull** - Queue management for notifications
- **redis** - Required for Bull queue

### API Documentation
- **swagger-jsdoc** - API documentation generation
- **swagger-ui-express** - API documentation UI

### HTTP Client
- **axios** - For KYC API integration and external services

### Logging
- **winston** - Advanced logging

## Module Organization

The codebase is organized into functional modules:

1. **Auth Module** - User authentication, JWT management
2. **KYC Module** - Identity verification via Kulipa
3. **Wallet Module** - Solana wallet generation and management
4. **Card Module** - Card tier selection and management
5. **BNPL Module** - Buy Now, Pay Later agreements and payments
6. **Score Module** - Credit scoring system
7. **Notification Module** - User alerts across channels
8. **Dashboard Module** - User data aggregation
9. **Admin Module** - Administrative controls and monitoring

## Development Workflow

1. **Setup Environment**:
   ```
   cp .env.example .env
   npm install
   ```

2. **Database Setup**:
   - Create PostgreSQL database
   - Update `.env` with database credentials

3. **Start Development Server**:
   ```
   npm run dev
   ```

4. **Build for Production**:
   ```
   npm run build
   npm start
   ```
