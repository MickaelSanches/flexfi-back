# Services

This directory contains the business logic implementation of the application, separate from the HTTP layer.

## Purpose
- Implement core business logic
- Interact with repositories for data access
- Handle complex operations and transactions
- Integrate with external services like Solana blockchain or KYC providers

## Expected Files
- `userService.ts` - User management functionality
- `kycService.ts` - KYC verification business logic
- `walletService.ts` - Solana wallet generation and encryption
- `solanaService.ts` - Solana RPC interaction and blockchain operations
- `cardService.ts` - Card tier management and fee structure
- `stakingService.ts` - Lock/unlock operations for collateral
- `bnplService.ts` - Payment schedule generation with fee calculation
- `scoreService.ts` - Score calculation and update logic
- `notificationService.ts` - User notification management 