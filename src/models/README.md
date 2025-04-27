# Models Directory

This directory contains Mongoose schemas and models that provide the data layer of the application. Models serve multiple important purposes in the architecture:

- Defining the structure and validation rules for MongoDB documents
- Providing a programmatic interface for database operations
- Implementing document middleware for pre/post hooks on operations
- Encapsulating data-related business rules (e.g., password hashing)
- Establishing relationships between different data entities

Models represent the core data entities in the FlexFi platform and are used by services to interact with the database in a structured, type-safe manner.

## Files

- **User.ts**: Defines the user schema with authentication methods, personal details, wallet information, and KYC status.
- **Wallet.ts**: Defines the wallet schema for tracking Solana wallets connected to or created by users.
- **KYC.ts**: Defines the Know Your Customer document schema for storing verification information.
- **Card.ts**: Defines the virtual payment card schema with details on card type, limits, and status.
- **Notification.ts**: Defines the notification schema for storing user-specific notifications with type, message, and read status. 