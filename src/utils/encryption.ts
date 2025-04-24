import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

// Vérifier les variables d'environnement requises
if (!ENCRYPTION_KEY) {
  throw new Error('ENCRYPTION_KEY environment variable is required');
}

// Fonction pour chiffrer la clé privée
export const encryptPrivateKey = (privateKey: string, userId: string): { 
  encryptedData: string, 
  iv: string, 
  authTag: string 
} => {
  // Dériver une clé spécifique à l'utilisateur
  const userSpecificKey = crypto
    .createHash('sha256')
    .update(ENCRYPTION_KEY + userId)
    .digest();

  // Générer un vecteur d'initialisation aléatoire
  const iv = crypto.randomBytes(16);
  
  // Créer le chiffreur
  const cipher = crypto.createCipheriv(ALGORITHM, userSpecificKey, iv);
  
  // Chiffrer la clé privée
  let encryptedData = cipher.update(privateKey, 'utf8', 'hex');
  encryptedData += cipher.final('hex');
  
  // Obtenir le tag d'authentification
  const authTag = cipher.getAuthTag().toString('hex');
  
  return {
    encryptedData,
    iv: iv.toString('hex'),
    authTag
  };
};

// Fonction pour déchiffrer la clé privée
export const decryptPrivateKey = (
  encryptedData: string,
  iv: string,
  authTag: string,
  userId: string
): string => {
  // Vérifier que la clé d'encryption est définie
  if (!ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY environment variable is required');
  }

  // Dériver la même clé spécifique à l'utilisateur
  const userSpecificKey = crypto
    .createHash('sha256')
    .update(ENCRYPTION_KEY + userId)
    .digest();
  
  // Créer le déchiffreur
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    userSpecificKey,
    Buffer.from(iv, 'hex')
  );
  
  // Définir le tag d'authentification
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));
  
  // Déchiffrer la clé privée
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};