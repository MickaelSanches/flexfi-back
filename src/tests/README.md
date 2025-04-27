# Tests Directory

This directory contains test files for the application, organized by test type. We use Jest as our primary testing framework with supporting libraries for HTTP testing and database mocking.

## Test Structure

- **integration/**: Contains tests that verify the interaction between multiple components, typically through API endpoints.
- **services/**: Contains unit tests for service-layer business logic.
- **utils/**: Contains tests for utility functions and helpers.

## Test Environment

- **setup.ts**: Configures the test environment including environment variables, test timeouts, and global setup.

## Testing Approach

1. **Unit Testing**: Focused on testing individual functions and methods in isolation.
2. **Integration Testing**: Tests the interaction between components via API endpoints.
3. **Mock Database**: Uses mongodb-memory-server to provide an isolated MongoDB instance for tests.

## Running Tests

```bash
# Run all tests
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Generate test coverage report
npm run test:coverage
```

## Environment Setup

Tests use a separate `.env.test` file that contains test-specific environment variables. This ensures that tests don't interfere with development or production databases.

A template file `.env.example.test` is created at the project root with appropriate test values for all required environment variables. 