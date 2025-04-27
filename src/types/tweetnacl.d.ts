declare module 'tweetnacl' {
  export interface KeyPair {
    publicKey: Uint8Array;
    secretKey: Uint8Array;
  }

  export interface BoxKeyPair extends KeyPair {}
  export interface SignKeyPair extends KeyPair {}

  export function randomBytes(n: number): Uint8Array;
  export function sign(message: Uint8Array, secretKey: Uint8Array): Uint8Array;
  export function sign_open(signedMessage: Uint8Array, publicKey: Uint8Array): Uint8Array | null;
  export function sign_detached(message: Uint8Array, secretKey: Uint8Array): Uint8Array;
  export function sign_verify_detached(signature: Uint8Array, message: Uint8Array, publicKey: Uint8Array): boolean;
  export function sign_keyPair(): SignKeyPair;
  export function sign_keyPair_fromSeed(seed: Uint8Array): SignKeyPair;

  export const sign: {
    keyPair(): SignKeyPair;
    keyPair_fromSeed(seed: Uint8Array): SignKeyPair;
    publicKeyLength: number;
    secretKeyLength: number;
    seedLength: number;
    signatureLength: number;
    detached: {
      sign(message: Uint8Array, secretKey: Uint8Array): Uint8Array;
      verify(message: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): boolean;
    }
  };

  export default {
    randomBytes,
    sign,
    sign_open,
    sign_detached,
    sign_verify_detached,
    sign_keyPair,
    sign_keyPair_fromSeed
  };
} 