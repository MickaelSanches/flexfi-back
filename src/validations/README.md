# Validations Directory

Ce répertoire contient les schémas de validation qui définissent les règles pour valider les données des requêtes entrantes. La couche de validation sert plusieurs objectifs importants :

- Assurer l'intégrité des données en rejetant les entrées malformées
- Protéger contre les injections et autres vulnérabilités
- Fournir des messages d'erreur clairs et cohérents
- Réduire le code de validation dans les controllers
- Créer une source unique de vérité pour les règles de validation

## Structure et Organisation

Chaque fichier de validation suit une structure similaire :

1. Import des dépendances (Joi, types)
2. Définition des schémas de validation
3. Export des middlewares de validation
4. Messages d'erreur personnalisés

## Validations Disponibles

### userValidations.ts

Gère la validation des données utilisateur :

- `registerSchema`: Validation de l'inscription
  ```typescript
  {
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    referralCodeUsed: Joi.string().optional()
  }
  ```
- `loginSchema`: Validation de la connexion
- `updateProfileSchema`: Validation de la mise à jour du profil

### waitlistValidations.ts

Gère la validation des données waitlist :

- `waitlistFormSchema`: Validation du formulaire waitlist
  ```typescript
  {
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().optional(),
    preferredLanguage: Joi.string().required(),
    country: Joi.string().required(),
    // ... autres champs
  }
  ```
- `referralCodeSchema`: Validation des codes de parrainage

### walletValidations.ts

Gère la validation des opérations wallet :

- `createWalletSchema`: Validation de la création
- `connectWalletSchema`: Validation de la connexion
- `transactionSchema`: Validation des transactions

### kycValidations.ts

Gère la validation des documents KYC :

- `documentSchema`: Validation des documents
- `statusSchema`: Validation des statuts
- `verificationSchema`: Validation de la vérification

## Bonnes Pratiques

1. **Messages d'Erreur**

   - Messages clairs et descriptifs
   - Localisation des messages
   - Codes d'erreur cohérents

2. **Validation des Types**

   - Utiliser les types TypeScript
   - Valider les enums
   - Gérer les valeurs nulles/undefined

3. **Sécurité**

   - Sanitizer les entrées
   - Valider les formats
   - Limiter les longueurs

4. **Performance**
   - Éviter les validations redondantes
   - Optimiser les regex
   - Utiliser la validation conditionnelle

## Exemple de Middleware de Validation

```typescript
export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        error: {
          message: "Validation failed",
          details: errors,
        },
      });
    }

    next();
  };
};
```

## Utilisation dans les Routes

```typescript
router.post(
  "/register",
  validateRequest(registerSchema),
  authController.register
);
```

## Gestion des Erreurs

Les erreurs de validation suivent une structure cohérente :

```typescript
{
  success: false,
  error: {
    message: string;
    details: Array<{
      field: string;
      message: string;
    }>;
  }
}
```
