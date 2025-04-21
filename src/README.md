# FlexFi Backend Source Code

This directory contains the source code for the FlexFi backend application, organized according to a clean architecture pattern.

## Directory Structure

- **`app.ts`**: Main application entry point
- **`controllers/`**: API endpoint handlers
- **`services/`**: Business logic implementation
- **`routes/`**: API route definitions
- **`repositories/`**: Database access layer
- **`middlewares/`**: Request processing middleware
- **`utils/`**: Helper functions and utilities
- **`types/`**: TypeScript type definitions
- **`config/`**: Configuration settings
- **`models/`**: Database entity models
- **`migrations/`**: Database migration files

## Architecture Pattern

The application follows a layered architecture pattern:

1. **HTTP Layer** (controllers, routes, middlewares)
2. **Business Layer** (services)
3. **Data Layer** (repositories, models)

This pattern promotes:
- Separation of concerns
- Testability
- Maintainability
- Scalability

## Module Organization

The code is organized around functional modules:

- **Auth Module**: User authentication and authorization
- **KYC Module**: Know Your Customer verification
- **Wallet Module**: Solana wallet management
- **Card Module**: FlexFi card tier selection and management
- **BNPL Module**: Buy Now, Pay Later agreements and installments
- **Score Module**: User credit scoring system
- **Notification Module**: User alerts and notifications 