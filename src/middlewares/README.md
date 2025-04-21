# Middlewares

This directory contains Express middleware functions that process requests before they reach the route handlers.

## Purpose
- Authentication and authorization checks
- Request validation and sanitization
- Logging and monitoring
- Error handling
- Rate limiting and security measures

## Expected Files
- `authMiddleware.ts` - JWT verification and user authentication
- `validationMiddleware.ts` - Request data validation
- `errorMiddleware.ts` - Centralized error handling
- `loggingMiddleware.ts` - Request/response logging
- `rateLimitMiddleware.ts` - API rate limiting 