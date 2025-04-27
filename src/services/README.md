# Services Directory

This directory contains the core business logic of the application, implementing the service layer pattern. Services are separated from controllers to achieve:

- Separation of concerns, keeping business logic distinct from HTTP handling
- Improved testability through smaller, focused functions with clear responsibilities
- Better reusability of business logic across different controllers
- Easier maintenance by centralizing domain-specific operations
- Implementation of complex workflows and transactions

Services interact with models to perform data operations and may communicate with external systems like the Solana blockchain. They contain no HTTP-specific code, making them usable in different contexts (API, CLI, scheduled jobs).

## Files

- **authService.ts**: Implements user authentication logic including token generation, verification, and OAuth processing.
- **cardService.ts**: Implements virtual card business logic like selection, creation, activation, and status updates.
- **delegationService.ts**: Handles Solana token delegation implementation, allowing FlexFi to perform transactions on behalf of users.
- **kycService.ts**: Implements Know Your Customer verification processes and status management.
- **notificationService.ts**: Implements notification creation, retrieval, and status management, including event-driven notification generation.
- **serviceInterfaces.ts**: Defines TypeScript interfaces for all services to enforce consistent implementations.
- **userService.ts**: Provides user management functionality like profile updates and data retrieval.
- **walletService.ts**: Implements Solana wallet operations including creation, connection, and transaction processing. 