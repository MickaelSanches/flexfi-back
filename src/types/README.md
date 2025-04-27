# Types Directory

This directory contains TypeScript type definitions used throughout the application. Strong typing is a key benefit of using TypeScript, enabling:

- Better code completion and IntelliSense in IDEs
- Compile-time type checking to catch errors early
- Self-documenting code through explicit interfaces and types
- Improved maintainability through explicit contracts between components

## Files

- **express.d.ts**: Contains type extensions for Express to support custom properties on the Request object, such as the authenticated user.
- **tweetnacl.d.ts**: Provides TypeScript declarations for the TweetNaCl.js library used for cryptographic operations in Solana interactions.

## Usage

Types from this directory are imported in various places throughout the codebase to provide type safety. For example, the UserDocument interface is used to properly type the authenticated user object in requests.

```typescript
// Example usage in middleware or controller
import { UserDocument } from '../types/express';

// Type casting for proper typing
const user = req.user as UserDocument;
const userId = user._id.toString();
```

## Type Extension Pattern

The pattern used in express.d.ts demonstrates how to extend types from third-party libraries:

```typescript
declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}
```

This allows TypeScript to properly recognize and type-check custom properties added to standard objects from libraries. 