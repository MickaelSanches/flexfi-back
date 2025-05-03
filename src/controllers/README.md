# Controllers Directory

Ce répertoire contient les gestionnaires de requêtes HTTP qui traitent les requêtes entrantes et retournent les réponses. Les controllers agissent comme une couche intermédiaire entre le client et la logique métier, suivant le pattern MVC (Model-View-Controller).

## Rôle des Controllers

Les controllers sont responsables de :

- Extraire et valider les données des objets de requête
- Appeler les méthodes de service appropriées avec les paramètres requis
- Gérer les erreurs et retourner les réponses HTTP appropriées
- Gérer le formatage des réponses et les codes de statut

## Structure et Organisation

Chaque controller suit une structure similaire :

1. Import des dépendances nécessaires
2. Définition de la classe du controller
3. Méthodes publiques pour chaque endpoint
4. Gestion des erreurs avec try/catch
5. Formatage des réponses

## Controllers Disponibles

### authController.ts

Gère toutes les opérations d'authentification :

- `register`: Création d'un nouvel utilisateur
  - Validation des données d'entrée
  - Création du compte
  - Génération du token JWT
- `login`: Connexion utilisateur
  - Vérification des identifiants
  - Génération du token JWT
- `getCurrentUser`: Récupération des données utilisateur
- `getTopReferrals`: Récupération des meilleurs parrainages

### waitlistController.ts

Gère les opérations liées à la liste d'attente :

- `registerWaitlistUser`: Enregistrement des données waitlist
  - Mise à jour des informations utilisateur
  - Attribution des points
  - Gestion des parrainages
- `getWaitlistCount`: Comptage des utilisateurs en liste d'attente
- `getReferralCount`: Comptage des parrainages
- `exportWaitlistData`: Export des données au format CSV

### walletController.ts

Gère les opérations liées aux wallets Solana :

- `createWallet`: Création d'un nouveau wallet
- `connectWallet`: Connexion d'un wallet existant
- `verifyWallet`: Vérification de la propriété du wallet
- `getWalletBalance`: Récupération du solde

### kycController.ts

Gère le processus de vérification KYC :

- `submitKyc`: Soumission des documents KYC
- `getKycStatus`: Vérification du statut KYC
- `updateKycStatus`: Mise à jour du statut KYC

### cardController.ts

Gère les opérations sur les cartes virtuelles :

- `selectCard`: Sélection d'une carte
- `activateCard`: Activation d'une carte
- `blockCard`: Blocage d'une carte
- `getCardStatus`: Vérification du statut

### notificationController.ts

Gère les notifications utilisateur :

- `getNotifications`: Récupération des notifications
- `markAsRead`: Marquage comme lu
- `getUnreadCount`: Comptage des non-lues

## Bonnes Pratiques

1. **Validation des Données**

   - Utiliser les middlewares de validation
   - Vérifier les types et formats
   - Gérer les cas d'erreur

2. **Gestion des Erreurs**

   - Utiliser les classes d'erreur personnalisées
   - Retourner des messages d'erreur clairs
   - Logger les erreurs appropriément

3. **Formatage des Réponses**

   - Utiliser des structures de réponse cohérentes
   - Inclure les métadonnées nécessaires
   - Gérer les cas de succès et d'erreur

4. **Sécurité**
   - Vérifier les permissions
   - Valider les tokens
   - Sanitizer les entrées

## Exemple de Structure de Réponse

```typescript
{
  success: boolean;
  data?: any;
  error?: {
    message: string;
    code: string;
  };
  metadata?: {
    timestamp: Date;
    requestId: string;
  };
}
```
