# Utils Directory

This directory contains utility functions and classes used throughout the application to provide common functionality.

## Files

- **AppError.ts**: Custom error class that extends the native Error class with additional properties for better error handling.
- **encryption.ts**: Provides encryption and decryption utilities using AES-256-GCM for securing sensitive data like private keys.
- **eventEmitter.ts**: Implements an event system for the application using the Observer pattern, enabling loosely coupled communication between components.
- **jwt.ts**: Implements JSON Web Token generation and verification for user authentication.
- **logger.ts**: Provides logging functionality for consistent application logging.
- **requestUtils.ts**: Contains helper functions for HTTP request handling, including safe user ID extraction from request objects.
- **solanaUtils.ts**: Contains utility functions for Solana blockchain interactions like signature verification and transaction building. 