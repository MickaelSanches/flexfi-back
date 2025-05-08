# API Routes Documentation

## Email Verification & Password Reset

### 1. Envoi du Code de Vérification

```http
POST /api/brevo/send-code
```

**Description:** Envoie un code de vérification à l'email de l'utilisateur.

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Réponse Succès:**

```json
{
  "message": "Verification code sent successfully"
}
```

**Erreurs Possibles:**

- 404: `{ "error": "User not found" }`
- 500: `{ "error": "Failed to send verification email" }`

### 2. Vérification du Code

```http
POST /api/auth/verify-code/:id
```

**Description:** Vérifie le code reçu par email.

**Paramètres URL:**

- `id`: ID MongoDB de l'utilisateur

**Request Body:**

```json
{
  "code": "123456"
}
```

**Réponse Succès:**

```json
{
  "message": "Code verified successfully"
}
```

**Erreurs Possibles:**

- 404: `{ "error": "User not found" }`
- 400: `{ "error": "Invalid verification code" }`

### 3. Processus de Réinitialisation de Mot de Passe

#### 3.1 Demande de Réinitialisation

```http
POST /api/auth/reset-password/request
```

**Description:** Envoie un email de réinitialisation de mot de passe.

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Réponse Succès:**

```json
{
  "message": "Password reset email sent successfully"
}
```

**Erreurs Possibles:**

- 404: `{ "error": "User not found" }`
- 500: `{ "error": "Failed to send password reset email" }`

#### 3.2 Réinitialisation du Mot de Passe

```http
POST /api/auth/reset-password/:token
```

**Description:** Réinitialise le mot de passe avec le token reçu par email.

**Paramètres URL:**

- `token`: Token de réinitialisation reçu par email

**Request Body:**

```json
{
  "password": "NouveauMotDePasse123"
}
```

**Réponse Succès:**

```json
{
  "message": "Password reset successfully"
}
```

**Erreurs Possibles:**

- 400: `{ "error": "Invalid or expired token" }`
- 400: `{ "error": "Password does not meet requirements" }`

## Notes Techniques

### Format des Données

- Les emails sont automatiquement convertis en minuscules
- Les codes de vérification sont des nombres à 6 chiffres
- Les tokens JWT expirent après 24 heures
- Les tokens de réinitialisation expirent après 1 heure

### Authentification

- Les routes Brevo sont publiques (pas besoin d'authentification)
- Les routes d'authentification nécessitent un token JWT dans le header:
  ```
  Authorization: Bearer <votre_token_jwt>
  ```

### Validation des Mots de Passe

Un mot de passe valide doit contenir:

- Minimum 12 caractères
- Au moins une majuscule
- Au moins une minuscule
- Au moins un chiffre
- Au moins un caractère spécial (@$!%\*?&)

### Exemples d'Utilisation

#### 1. Envoi du Code de Vérification

```typescript
const response = await fetch("/api/brevo/send-code", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "user@example.com" }),
});
```

#### 2. Vérification du Code

```typescript
const response = await fetch(`/api/auth/verify-code/${userId}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ code: "123456" }), // code que l'utilisateur rentrera
});
```

#### 3.1 Demande de Réinitialisation

```typescript
const response = await fetch("/api/auth/reset-password/request", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "user@example.com" }),
});
```

#### 3.2 Réinitialisation du Mot de Passe

```typescript
const response = await fetch(`/api/auth/reset-password/${resetToken}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ password: "NouveauMotDePasse123" }),
});
```
