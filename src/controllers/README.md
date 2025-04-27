# Controllers Directory

This directory contains HTTP request handlers that process incoming requests and return responses. Controllers act as an intermediary layer between the client and the business logic, following the MVC (Model-View-Controller) pattern. They are responsible for:

- Extracting and validating data from request objects
- Calling appropriate service methods with the required parameters
- Handling errors and returning appropriate HTTP responses
- Managing response formatting and status codes

Controllers keep the route definitions clean by encapsulating the request handling logic, while delegating complex business operations to the service layer.

## Files

- **authController.ts**: Handles user authentication operations including registration, login, and OAuth authentication flows.
- **cardController.ts**: Manages virtual card operations such as selection, activation, and blocking.
- **delegationController.ts**: Handles Solana token delegation operations for enabling FlexFi to perform transactions on behalf of users.
- **kycController.ts**: Manages the Know Your Customer verification process and status updates.
- **walletController.ts**: Handles Solana wallet operations including creation, connection, and verification. 