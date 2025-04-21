# Models

This directory contains the TypeORM entity models that define the database schema.

## Purpose
- Define database tables and relationships
- Set column types, constraints, and defaults
- Implement entity validation with decorators
- Establish relationships between different entities

## Expected Files
- `User.ts` - User account information
- `RefreshToken.ts` - Authentication refresh tokens
- `Wallet.ts` - User wallet information
- `WalletTransaction.ts` - Wallet transaction records
- `StakingRecord.ts` - Collateral staking records
- `BnplAgreement.ts` - BNPL agreement details
- `Installment.ts` - Payment installment records
- `ScoreHistory.ts` - User scoring history
- `CardType.ts` - Card tier definitions
- `Notification.ts` - User notification records 