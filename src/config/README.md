# Configuration Directory

This directory contains configuration files that centralize and manage application settings. Configuration is separated from code to achieve:

- Environment-specific settings that can be changed without modifying code
- Centralized management of external service connections
- Secure handling of sensitive information through environment variables
- Consistent access to configuration throughout the application
- Easier deployment across different environments (development, staging, production)

The configuration approach helps maintain the Twelve-Factor App methodology principle of strict separation between configuration and code, making the application more maintainable and deployable.

## Files

- **auth.ts**: Contains configuration settings for authentication providers (Google, Apple, Twitter) and Passport strategies.
- **database.ts**: Handles MongoDB connection setup and provides the database connection function.
- **env.ts**: Manages environment variables and provides validation for required configuration variables.
- **solana.ts**: Contains Solana blockchain network configuration and connection settings. 