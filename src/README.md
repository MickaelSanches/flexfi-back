# Source Code Directory

This directory contains the main source code for the FlexFi backend application, a financial platform that connects traditional finance to the Solana blockchain. The codebase follows a layered architecture that separates concerns and promotes maintainability.

## Architecture Overview

The FlexFi backend implements a modular architecture with clear separation of responsibilities:

1. **API Layer** (routes, controllers) - Handles HTTP requests/responses and input validation
2. **Service Layer** (services) - Contains core business logic and orchestrates operations
3. **Data Layer** (models) - Manages data persistence and database interactions
4. **Infrastructure Layer** (utils, config) - Provides cross-cutting utilities and configuration
5. **Event System** (eventEmitter) - Implements an event-driven architecture for loosely coupled components

This architecture promotes:
- **Modularity**: Components can be developed and tested independently
- **Maintainability**: Changes to one layer have minimal impact on others
- **Testability**: Business logic can be tested without HTTP or database dependencies
- **Separation of Concerns**: Each component has a distinct responsibility
- **Loose Coupling**: Components communicate through events rather than direct dependencies

## Directory Structure

- **app.ts**: Main Express application configuration file that sets up middleware, routes, and error handling.
- **index.ts**: Entry point of the application that initializes the server and connects to the database.
- **config/**: Contains configuration files for various parts of the application.
- **controllers/**: Contains HTTP request handlers that process incoming requests and return responses.
- **middlewares/**: Contains Express middleware functions for authentication, error handling, and validation.
- **models/**: Contains Mongoose schemas and models for database interaction.
- **routes/**: Contains Express route definitions that map API endpoints to controller functions.
- **services/**: Contains business logic separated from controllers for better modularity.
- **tests/**: Contains test files for the application.
- **types/**: Contains TypeScript type definitions.
- **utils/**: Contains utility functions used throughout the application, including event emitters.
- **validations/**: Contains validation schemas for request data.
- **scripts/**: Contains utility scripts for various operations. 