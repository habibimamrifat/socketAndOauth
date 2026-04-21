import { registerAs } from '@nestjs/config';

export const oauthEnvConfig = registerAs('oauth', () => {
  return {
    googleId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
});
