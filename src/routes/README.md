# Routes Directory

This directory contains Express route definitions that establish the API endpoints of the application. Routes are a critical part of the backend architecture that:

- Define the URL patterns and HTTP methods that the API responds to
- Connect incoming requests to the appropriate controller functions
- Apply middleware for authentication, validation, and other request processing
- Group related endpoints for better organization and maintenance
- Establish the public interface and contract of the API

The route structure follows RESTful principles where appropriate, with resources like users, wallets, and cards having their own dedicated route files and consistent URL patterns.

## Files

- **index.ts**: Main router file that combines and exports all route modules.
- **authRoutes.ts**: Routes for authentication operations including registration, login, and OAuth flows.
- **walletRoutes.ts**: Routes for Solana wallet operations like creation, connection, and delegation.
- **kycRoutes.ts**: Routes for KYC submission and status checking.
- **cardRoutes.ts**: Routes for virtual card operations including selection, activation, and management. 