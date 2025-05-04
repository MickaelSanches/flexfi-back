# Models Directory

Ce répertoire contient les schémas et modèles Mongoose qui constituent la couche de données de l'application. Les modèles servent plusieurs objectifs importants dans l'architecture :

- Définir la structure et les règles de validation des documents MongoDB
- Fournir une interface programmatique pour les opérations de base de données
- Implémenter des middleware pour les hooks pre/post sur les opérations
- Encapsuler les règles métier liées aux données (ex: hachage des mots de passe)
- Établir les relations entre les différentes entités de données

Models represent the core data entities in the FlexFi platform and are used by services to interact with the database in a structured, type-safe manner.

## Flow Utilisateur pour le Frontend

### 1. Création Initiale d'Utilisateur

**Route**: `POST /api/auth/register`
**Interface**: `IBasicUser`

```typescript
{
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  referralCodeUsed?: string;
}
```

**Réponse**:

- Status: 201
- Token JWT pour l'authentification
- Données utilisateur de base

### 2. Formulaire Waitlist

**Route**: `POST /api/waitlist`
**Interface**: `IWaitlistFormData`

```typescript
{
  email: string;                    // Doit correspondre à l'email de création
  phoneNumber?: string;
  telegramOrDiscordId?: string;
  preferredLanguage: string;
  country: string;
  stateProvince: string;
  ageGroup: string;
  employmentStatus: string;
  monthlyIncome: string;
  educationLevel: string;
  hasCreditCard: boolean;
  bnplServices: string[];
  avgOnlineSpend: string;
  cryptoLevel: string;
  walletType: string;
  portfolioSize: string;
  favoriteChains: string[];
  publicWallet?: string;
  mainReason: string;
  firstPurchase?: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  timeToCompletionSeconds: number;
  experienceBnplRating: number;
  consentAdult: boolean;
  consent_data_sharing: boolean;
  consent_data_sharing_date: Date;
  consentMarketing: boolean;
  signupTimestamp: Date;
}
```

**Réponse**:

- Status: 201 si succès
- Status: 404 si l'utilisateur n'existe pas
- Status: 409 si le formulaire a déjà été soumis
- Points: +20 points ajoutés à l'utilisateur

### Points Importants pour le Frontend

1. L'utilisateur doit d'abord être créé via `/api/auth/register`
2. Le formulaire waitlist ne peut être soumis qu'une seule fois
3. L'email dans le formulaire waitlist doit correspondre à l'email de création
4. Les points sont automatiquement ajoutés après soumission du formulaire
5. Le statut `formFullfilled` est mis à `true` après soumission

## Fichiers

- **User.ts**: Définit le schéma utilisateur avec :

  - Authentification (email, mot de passe, OAuth)
  - Données personnelles
  - Informations de wallet
  - Statut KYC
  - Données waitlist
  - Système de points et parrainage

- **Wallet.ts**: Définit le schéma pour les wallets Solana connectés ou créés par les utilisateurs
- **KYC.ts**: Définit le schéma pour les documents de vérification KYC
- **Card.ts**: Définit le schéma pour les cartes de paiement virtuelles
- **Notification.ts**: Définit le schéma pour les notifications utilisateur

## Modèles disponibles

### User

Représente un utilisateur de la plateforme FlexFi.

### Wallet

Représente un portefeuille crypto associé à un utilisateur.

### KYC

Stocke les informations et le statut de vérification KYC d'un utilisateur.

### Card

Gère les informations des cartes virtuelles des utilisateurs.

### Notification

Stocke les notifications envoyées aux utilisateurs.

### LOI

Stocke les informations des Letter of Intent (LOI) soumises par les partenaires commerciaux.
