# Services Directory

Ce répertoire contient la logique métier principale de l'application, implémentant le pattern de couche service. Les services sont séparés des controllers pour :

- Séparer les responsabilités, en gardant la logique métier distincte de la gestion HTTP
- Améliorer la testabilité via des fonctions plus petites et ciblées
- Faciliter la réutilisation de la logique métier
- Centraliser les opérations spécifiques au domaine
- Implémenter des workflows et transactions complexes

## Structure et Organisation

Chaque service suit une structure similaire :

1. Import des dépendances nécessaires
2. Définition de la classe du service
3. Méthodes publiques pour chaque opération métier
4. Gestion des transactions et des erreurs
5. Interaction avec les modèles et services externes

## Services Disponibles

### authService.ts

Gère toute la logique d'authentification :

- `register`: Création d'un nouvel utilisateur
  - Génération du code de parrainage
  - Hachage du mot de passe
  - Création du token JWT
- `login`: Authentification utilisateur
  - Vérification des identifiants
  - Génération du token JWT
- `verifyToken`: Vérification des tokens JWT
- `refreshToken`: Renouvellement des tokens

### waitlistService.ts

Gère la logique de la liste d'attente :

- `registerWaitlistInfo`: Enregistrement des données waitlist
  - Mise à jour des informations utilisateur
  - Attribution des points (+20)
  - Gestion des parrainages
- `getWaitlistCount`: Comptage des utilisateurs
- `getReferralCount`: Comptage des parrainages
- `exportWaitlistData`: Export des données

### walletService.ts

Gère les opérations blockchain Solana :

- `createWallet`: Création d'un nouveau wallet
  - Génération des clés
  - Enregistrement en base
- `connectWallet`: Connexion d'un wallet existant
- `verifyWallet`: Vérification de propriété
- `getBalance`: Récupération du solde
- `sendTransaction`: Envoi de transactions

### kycService.ts

Gère le processus KYC :

- `submitKyc`: Soumission des documents
  - Vérification des documents
  - Mise à jour du statut
- `getKycStatus`: Vérification du statut
- `updateKycStatus`: Mise à jour du statut
- `verifyDocuments`: Vérification des documents

### cardService.ts

Gère les cartes virtuelles :

- `createCard`: Création d'une carte
  - Génération des détails
  - Activation initiale
- `activateCard`: Activation d'une carte
- `blockCard`: Blocage d'une carte
- `getCardStatus`: Vérification du statut

### notificationService.ts

Gère les notifications :

- `createNotification`: Création d'une notification
- `getNotifications`: Récupération des notifications
- `markAsRead`: Marquage comme lu
- `getUnreadCount`: Comptage des non-lues

## Bonnes Pratiques

1. **Gestion des Transactions**

   - Utiliser les sessions MongoDB
   - Gérer les rollbacks
   - Maintenir la cohérence des données

2. **Gestion des Erreurs**

   - Utiliser des classes d'erreur personnalisées
   - Logger les erreurs appropriément
   - Propager les erreurs aux controllers

3. **Performance**

   - Optimiser les requêtes MongoDB
   - Utiliser les index appropriés
   - Gérer le cache si nécessaire

4. **Sécurité**
   - Valider les entrées
   - Gérer les permissions
   - Protéger les données sensibles

## Exemple de Structure de Service

```typescript
class ExampleService {
  constructor(
    private readonly model: Model,
    private readonly externalService: ExternalService
  ) {}

  async createResource(data: CreateResourceDto): Promise<Resource> {
    const session = await this.model.startSession();
    try {
      session.startTransaction();

      const resource = await this.model.create([data], { session });
      await this.externalService.process(resource);

      await session.commitTransaction();
      return resource;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
```
