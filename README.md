# FlexFi Backend

FlexFi est une plateforme financière décentralisée qui connecte la finance traditionnelle à la blockchain Solana, permettant aux utilisateurs de gérer leurs actifs crypto, de passer le KYC et d'obtenir des cartes de paiement virtuelles.

## 🚀 Fonctionnalités

- **Authentification multi-méthode** - Email/mot de passe et OAuth (Google, Apple, Twitter)
- **Gestion de portefeuilles Solana** - Création et connexion de wallets avec sécurité avancée
- **Vérification KYC** - Processus complet de Know Your Customer
- **Cartes virtuelles** - Cartes de paiement avec différents niveaux et limites
- **Délégation de tokens** - Permet à FlexFi d'effectuer des transactions pour l'utilisateur
- **Sécurité avancée** - Chiffrement AES-256-GCM, protection JWT, validation d'entrées

## 📋 Prérequis

- Node.js v16+
- MongoDB
- Compte Solana (pour les fonctionnalités de blockchain)

## 🔧 Installation

1. Cloner le dépôt
   ```bash
   git clone https://github.com/votre-username/flexfi-backend.git
   cd flexfi-backend
   ```

2. Installer les dépendances
   ```bash
   npm install
   ```

3. Configurer les variables d'environnement
   ```bash
   cp .env.example .env
   # Modifier le fichier .env avec vos propres configurations
   ```

4. Lancer le serveur de développement
   ```bash
   npm run dev
   ```

## 🏗️ Structure du projet

```
/flexfi-backend
├── /src                          # Code source principal
│   ├── /config                   # Configuration
│   ├── /controllers              # Contrôleurs HTTP
│   ├── /middlewares              # Middlewares Express
│   ├── /models                   # Modèles de données Mongoose
│   ├── /routes                   # Routes API
│   ├── /services                 # Logique métier
│   ├── /tests                    # Tests
│   ├── /types                    # Types et interfaces TypeScript
│   ├── /utils                    # Utilitaires
│   ├── /validations              # Schémas de validation
│   ├── app.ts                    # Configuration de l'application Express
│   └── index.ts                  # Point d'entrée principal
└── ...
```

## 🔑 Variables d'environnement

Pour exécuter ce projet, vous devez configurer les variables d'environnement suivantes dans votre fichier `.env` :

```
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=votre_uri_mongodb

# JWT
JWT_SECRET=votre_jwt_secret_key
JWT_EXPIRES_IN=7d

# Encryption
ENCRYPTION_KEY=votre_cle_de_32_caracteres_min

# Solana
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_NETWORK=devnet
FLEXFI_DELEGATE_PUBKEY=votre_cle_publique_delegue
FLEXFI_DELEGATE_PRIVATE_KEY=votre_cle_privee_delegue

# OAuth (optionnels pour le développement)
GOOGLE_CLIENT_ID=votre_client_id
GOOGLE_CLIENT_SECRET=votre_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

APPLE_CLIENT_ID=votre_client_id
APPLE_TEAM_ID=votre_team_id
APPLE_KEY_ID=votre_key_id
APPLE_PRIVATE_KEY_LOCATION=chemin_vers_votre_cle
APPLE_CALLBACK_URL=http://localhost:3000/api/auth/apple/callback

TWITTER_CONSUMER_KEY=votre_consumer_key
TWITTER_CONSUMER_SECRET=votre_consumer_secret
TWITTER_CALLBACK_URL=http://localhost:3000/api/auth/twitter/callback
```

## 📝 API Endpoints

### Authentification

- `POST /api/auth/register` - Inscription avec email/mot de passe
- `POST /api/auth/login` - Connexion avec email/mot de passe
- `GET /api/auth/google` - Authentification Google
- `GET /api/auth/apple` - Authentification Apple
- `GET /api/auth/twitter` - Authentification Twitter
- `GET /api/auth/me` - Récupérer l'utilisateur actuel

### Wallets

- `POST /api/wallet/create` - Créer un nouveau wallet
- `POST /api/wallet/connect` - Connecter un wallet existant
- `GET /api/wallet` - Récupérer les wallets de l'utilisateur
- `GET /api/wallet/verification-message` - Générer un message de vérification
- `POST /api/wallet/delegate/instruction` - Créer une instruction de délégation
- `POST /api/wallet/delegate/update-status` - Mettre à jour le statut de délégation

### KYC

- `POST /api/kyc/submit` - Soumettre une demande KYC
- `GET /api/kyc/status` - Récupérer le statut KYC

### Cartes

- `POST /api/card/select` - Sélectionner un type de carte
- `GET /api/card` - Récupérer la carte de l'utilisateur
- `POST /api/card/:cardId/activate` - Activer une carte
- `POST /api/card/:cardId/block` - Bloquer une carte

## 🧪 Tests

Pour exécuter les tests :

```bash
# Exécuter tous les tests
npm test

# Exécuter les tests unitaires
npm run test:unit

# Exécuter les tests d'intégration
npm run test:integration

# Vérifier la couverture des tests
npm run test:coverage
```

## 📚 Commandes disponibles

- `npm run dev` - Lancer le serveur de développement avec hot-reload
- `npm run build` - Compiler le TypeScript en JavaScript
- `npm start` - Démarrer l'application en mode production
- `npm test` - Exécuter les tests
- `npm run lint` - Linter le code
- `npm run format` - Formater le code

## 🔐 Sécurité

Cette application implémente plusieurs mesures de sécurité :

- **Chiffrement des clés privées** - Les clés privées sont chiffrées avec AES-256-GCM
- **JWT sécurisés** - Authentification via JSON Web Tokens
- **CORS** - Protection contre les requêtes cross-origin
- **Helmet** - Protection contre les vulnérabilités web courantes
- **Validation d'entrée** - Tous les inputs sont validés avant traitement

