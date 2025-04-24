import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

// Middleware pour valider les requêtes
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Exécuter toutes les validations
    await Promise.all(validations.map(validation => validation.run(req)));
    
    // Vérifier s'il y a des erreurs de validation
    const errors = validationResult(req);
    
    if (errors.isEmpty()) {
      return next();
    }
    
    // S'il y a des erreurs, les renvoyer au client
    res.status(400).json({ errors: errors.array() });
  };
};