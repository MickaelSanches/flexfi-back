# Controllers

This directory contains the API endpoint handlers that process incoming HTTP requests and return responses.

## Purpose
- Handle HTTP requests and responses
- Validate request data
- Call appropriate services to execute business logic
- Format and return responses

## Expected Files
- `authController.ts` - Authentication and user management endpoints
- `kycController.ts` - KYC verification flow and status updates
- `walletController.ts` - Wallet generation and management
- `cardController.ts` - Card selection and tier management
- `bnplController.ts` - BNPL agreement creation and management
- `scoreController.ts` - User scoring information and history 