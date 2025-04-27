# Middlewares Directory

This directory contains Express middleware functions that intercept and process HTTP requests and responses. Middlewares are essential components in the Express.js architecture that:

- Execute code before or after route handlers
- Modify request or response objects
- End the request-response cycle early when necessary
- Call the next middleware in the stack

In FlexFi, middlewares handle cross-cutting concerns like authentication, error handling, and request validation, keeping these aspects separate from business logic and route definitions, which improves code organization and maintainability.

## Files

- **authMiddleware.ts**: Implements JWT authentication middleware that verifies user tokens and attaches user information to request objects.
- **errorMiddleware.ts**: Provides centralized error handling for the application, including custom error types and formatting.
- **validationMiddleware.ts**: Implements request validation middleware using validation schemas to ensure data integrity. 