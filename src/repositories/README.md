# Repositories

This directory contains the database access layer, abstracting and encapsulating the data storage operations.

## Purpose
- Provide data access methods for the service layer
- Hide database implementation details
- Handle complex queries and transactions
- Maintain data integrity and relationships

## Expected Files
- `userRepository.ts` - User data access
- `walletRepository.ts` - Wallet data operations
- `stakingRepository.ts` - Collateral staking records access
- `bnplRepository.ts` - BNPL agreement data management
- `installmentRepository.ts` - Payment installment records
- `scoreRepository.ts` - User scoring history and updates
- `notificationRepository.ts` - Notification data access
- `cardRepository.ts` - Card tier data management 