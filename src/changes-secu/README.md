- **Rate Limiting :**  
  - Création du middleware `rateLimiter.ts`  
  - Limitation à **5 requêtes / 15 min** pour les routes critiques :  
    - `/register`
    - `/login`
    - `/reset-password`
    - `/send-code`

- **Input Validation :**  
  - Ajout des validations suivantes :  
    - `loginUserValidation` : Vérification des inputs email/password pour `/login`  
    - `resetPasswordValidation` : Vérification des inputs pour `/verify-reset-password`

<!-- - **JWT Revocation :**  
  - Création de `checkToken.ts` pour gérer la **révocation des tokens JWT**  
  - Les tokens sont ajoutés à une **liste noire temporaire** lors du logout.  
  - Objectif : Éviter la réutilisation de tokens expirés ou révoqués. -->

- **Logging des tentatives échouées :**  
  - Création de `logFailedLogin.ts` : Loggue les tentatives échouées avec `email` et `IP`.  

  <!-- - **Encryption des clés privées :**  
  - Révision de `encryption.ts` pour utiliser une **clé dérivée par utilisateur** (`ENCRYPTION_KEY + userId`).  
  - Objectif : Réduire l'impact d'une compromission de `ENCRYPTION_KEY`. -->

- **Signature des transactions :**  
  - Vérification systématique des signatures dans `solanaUtils.ts`.  
  - Utilisation de `tweetnacl` pour **éviter les falsifications**.

<!-- - **Limitation des délégations :**  
  - Les délégations sont limitées à **5 par utilisateur** (`walletService.ts`).  
  - Les délégations échouées sont **logguées** avec le `userId` et le `publicKey`. -->

- **Logging des transactions :**  
  - Les transactions échouées sont logguées avec le `userId`, `publicKey` et le **message d’erreur**.

  - **Rate Limiting :**  
  - Application du rate limiter `rateLimiter.ts` sur les routes `/waitlist/register` et `/zealy/sync-points`.

- **Input Validation :**  
  - Ajout de `waitlistValidations.ts` pour valider les inputs :  
    - Email, téléphone, services BNPL, portefeuille crypto.

- **Global Rate Limiter :**
  - 100 requêtes max / 15 min par IP (configurable via `globalRateLimiter.ts`).
  - Appliqué à **toutes les routes** dès la couche `app.ts`.
 