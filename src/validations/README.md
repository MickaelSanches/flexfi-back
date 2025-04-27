# Validations Directory

This directory contains validation schemas that define the rules for validating incoming request data. The validation layer serves several important purposes:

- Ensuring data integrity by rejecting malformed or invalid inputs
- Protecting against injection attacks and other security vulnerabilities
- Providing clear, consistent error messages for invalid requests
- Reducing boilerplate validation code in controllers
- Creating a single source of truth for data validation rules

By centralizing validation logic, the application maintains consistent data quality standards and improves security by thoroughly validating all inputs before processing.

## Files

- **walletValidations.ts**: Contains validation schemas for wallet-related operations like creation, connection, and delegation. 