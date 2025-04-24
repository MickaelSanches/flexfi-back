// export const solanaConfig = {
//     rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
//     network: process.env.SOLANA_NETWORK || 'devnet',
//     delegatePublicKey: process.env.FLEXFI_DELEGATE_PUBKEY || '',
//     delegatePrivateKey: process.env.FLEXFI_DELEGATE_PRIVATE_KEY || '',
//   };


export const solanaConfig = {
  rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
  network: process.env.SOLANA_NETWORK || 'devnet',
  delegatePublicKey: 'iDc5xocYcovheHitHamo6hkbxd7PK4ZWuw2DNsV5R8V',
  delegatePrivateKey: process.env.FLEXFI_DELEGATE_PRIVATE_KEY || '',
};