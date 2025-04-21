# Routes

This directory contains the API route definitions, connecting endpoints to their respective controllers.

## Purpose
- Define API endpoints and versioning
- Connect routes to controller methods
- Apply middleware for authentication, validation, etc.
- Organize routes by domain/functionality

## Expected Files
- `authRoutes.ts` - Authentication routes (/api/auth/*)
- `kycRoutes.ts` - KYC verification routes (/api/kyc/*)
- `walletRoutes.ts` - Wallet management routes (/api/wallet/*)
- `cardRoutes.ts` - Card selection routes (/api/card/*)
- `bnplRoutes.ts` - BNPL agreement routes (/api/bnpl/*)
- `scoreRoutes.ts` - Score information routes (/api/score/*)
- `index.ts` - Route aggregation and configuration 