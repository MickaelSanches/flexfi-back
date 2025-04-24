export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    
    constructor(message: string, statusCode: number, isOperational = true) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = isOperational;
      
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  // Erreurs courantes
  export const BadRequestError = (message: string) => new AppError(message, 400);
  export const UnauthorizedError = (message = 'Unauthorized') => new AppError(message, 401);
  export const ForbiddenError = (message = 'Forbidden') => new AppError(message, 403);
  export const NotFoundError = (message = 'Resource not found') => new AppError(message, 404);
  export const ConflictError = (message: string) => new AppError(message, 409);
  export const InternalError = (message = 'Internal server error') => new AppError(message, 500, false);