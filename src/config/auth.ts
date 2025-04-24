// export const authConfig = {
//     google: {
//       clientID: process.env.GOOGLE_CLIENT_ID || '',
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
//       callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback'
//     },
//     apple: {
//       clientID: process.env.APPLE_CLIENT_ID || '',
//       teamID: process.env.APPLE_TEAM_ID || '',
//       keyID: process.env.APPLE_KEY_ID || '',
//       privateKeyLocation: process.env.APPLE_PRIVATE_KEY_LOCATION || '',
//       callbackURL: process.env.APPLE_CALLBACK_URL || 'http://localhost:3000/api/auth/apple/callback'
//     },
//     twitter: {
//       consumerKey: process.env.TWITTER_CONSUMER_KEY || '',
//       consumerSecret: process.env.TWITTER_CONSUMER_SECRET || '',
//       callbackURL: process.env.TWITTER_CALLBACK_URL || 'http://localhost:3000/api/auth/twitter/callback'
//     }
//   };

export const authConfig = {
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID || 'dummy-client-id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-client-secret',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback'
  },
  apple: {
    clientID: process.env.APPLE_CLIENT_ID || 'dummy-client-id',
    teamID: process.env.APPLE_TEAM_ID || 'dummy-team-id',
    keyID: process.env.APPLE_KEY_ID || 'dummy-key-id',
    privateKeyLocation: process.env.APPLE_PRIVATE_KEY_LOCATION || 'dummy-path',
    callbackURL: process.env.APPLE_CALLBACK_URL || 'http://localhost:3000/api/auth/apple/callback'
  },
  twitter: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY || 'dummy-consumer-key',
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET || 'dummy-consumer-secret',
    callbackURL: process.env.TWITTER_CALLBACK_URL || 'http://localhost:3000/api/auth/twitter/callback'
  }
};