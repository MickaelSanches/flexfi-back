import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

// Middleware pour gérer les erreurs
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Journaliser l'erreur
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: req.user && 'id' in req.user ? req.user.id : undefined,

  });
  
  // Déterminer le code de statut et si l'erreur est opérationnelle
  const statusCode = (err as AppError).statusCode || 500;
  const isOperational = (err as AppError).isOperational !== undefined 
    ? (err as AppError).isOperational 
    : false;
  
  // Répondre avec l'erreur
  res.status(statusCode).json({
    status: 'error',
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && !isOperational && { stack: err.stack })
  });
};

// Middleware pour gérer les routes non trouvées
export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  next(new AppError(`Not Found - ${req.originalUrl}`, 404));
};