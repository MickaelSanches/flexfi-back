# Exemples de requêtes curl pour l'API FlexFi

Ce document contient des exemples de commandes curl pour tester l'API FlexFi. Ces commandes vous permettent de tester rapidement les endpoints de l'API depuis votre terminal.

## Table des matières
1. [Authentification](#authentification)
2. [Gestion des wallets](#gestion-des-wallets)
3. [Vérification KYC](#vérification-kyc)
4. [Cartes virtuelles](#cartes-virtuelles)
5. [LOI (Letter of Intent)](#loi)

## Authentification

### Inscription d'un nouvel utilisateur
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Connexion
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Récupérer l'utilisateur courant
Remplacez `VOTRE_TOKEN_JWT` par le token reçu lors de la connexion.
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT"
```

## Gestion des wallets

### Créer un nouveau wallet
```bash
curl -X POST http://localhost:3000/api/wallet/create \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT"
```

### Récupérer les wallets de l'utilisateur
```bash
curl -X GET http://localhost:3000/api/wallet \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT"
```

### Obtenir un message de vérification pour connecter un wallet
```bash
curl -X GET http://localhost:3000/api/wallet/verification-message \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT"
```

### Connecter un wallet existant
Ce processus nécessite la signature d'un message avec la clé privée du wallet Solana. Vous devez d'abord générer une signature à l'aide du SDK Solana.
```bash
curl -X POST http://localhost:3000/api/wallet/connect \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT" \
  -d '{
    "publicKey": "VOTRE_CLE_PUBLIQUE_SOLANA",
    "signature": "SIGNATURE_DU_MESSAGE",
    "message": "MESSAGE_VERIFIE"
  }'
```

### Créer une instruction de délégation
```bash
curl -X POST http://localhost:3000/api/wallet/delegate/instruction \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT" \
  -d '{
    "publicKey": "VOTRE_CLE_PUBLIQUE_SOLANA",
    "tokenAccount": "ADRESSE_DU_COMPTE_TOKEN",
    "amount": 1000
  }'
```

### Mettre à jour le statut de délégation
```bash
curl -X POST http://localhost:3000/api/wallet/delegate/update-status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT" \
  -d '{
    "publicKey": "VOTRE_CLE_PUBLIQUE_SOLANA",
    "tokenAccount": "ADRESSE_DU_COMPTE_TOKEN"
  }'
```

## Vérification KYC

### Soumettre une demande KYC
```bash
curl -X POST http://localhost:3000/api/kyc/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-01",
    "nationality": "France",
    "idType": "passport",
    "idNumber": "AB123456",
    "address": {
      "street": "123 Main St",
      "city": "Paris",
      "postalCode": "75001",
      "country": "France"
    }
  }'
```

### Vérifier le statut KYC
```bash
curl -X GET http://localhost:3000/api/kyc/status \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT"
```

### Simuler un webhook Kulipa (pour le développement)
```bash
# Générer une signature valide (à des fins de test uniquement)
# En production, la signature est générée par Kulipa
PAYLOAD='{"reference":"KULIPA-123456789","status":"approved","verification_data":{"fullName":"John Doe"}}'
WEBHOOK_SECRET='test-kulipa-webhook-secret'
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$WEBHOOK_SECRET" | cut -d' ' -f2)

# Envoyer le webhook
curl -X POST http://localhost:3000/api/kyc/webhook \
  -H "Content-Type: application/json" \
  -H "x-kulipa-signature: $SIGNATURE" \
  -d "$PAYLOAD"
```

## Cartes virtuelles

### Sélectionner un type de carte
Nécessite que le KYC soit approuvé.
```bash
curl -X POST http://localhost:3000/api/card/select \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT" \
  -d '{
    "cardType": "standard"
  }'
```

### Obtenir les détails de la carte
```bash
curl -X GET http://localhost:3000/api/card \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT"
```

### Activer une carte
Remplacez `CARD_ID` par l'ID de la carte retourné lors de la sélection.
```bash
curl -X POST http://localhost:3000/api/card/CARD_ID/activate \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT"
```

### Bloquer une carte
```bash
curl -X POST http://localhost:3000/api/card/CARD_ID/block \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT"
```

## Utilisation avec un token réel

Pour éviter de copier-coller le token dans chaque commande, vous pouvez stocker le token dans une variable shell :

```bash
# Stocker le token après connexion
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}' \
  | jq -r '.data.token')

# Ensuite utiliser la variable TOKEN
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

Note: Cette méthode nécessite l'outil `jq` pour parser la réponse JSON.

## LOI (Letter of Intent)

### Submit LOI form

```bash
curl -X POST http://localhost:3000/api/loi \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "company": "Acme Corp",
    "email": "john.doe@example.com",
    "country": "United States",
    "sector": "Technology",
    "comments": "Looking forward to our partnership",
    "signature": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAC..."
  }'
```

### Get all LOIs

```bash
curl -X GET http://localhost:3000/api/loi
```

### Get a specific LOI by ID

```bash
curl -X GET http://localhost:3000/api/loi/60a1b2c3d4e5f6g7h8i9j0k1
```

### Download LOI PDF

```bash
curl -X GET http://localhost:3000/api/loi/60a1b2c3d4e5f6g7h8i9j0k1/download --output loi.pdf
``` 