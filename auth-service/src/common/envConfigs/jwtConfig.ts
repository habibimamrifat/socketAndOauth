import { registerAs } from '@nestjs/config';

export const jwtEnvConfig = registerAs('jwt', () => {
  return {
    accessToken: process.env.JWT_SECRET,
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET,

    accessTokenExpireIN: process.env.JWT_EXPIRES_IN
      ? parseInt(process.env.JWT_EXPIRES_IN)
      : 3600,
    refreshTokenExpireIn: process.env.JWT_REFRESH_EXPIRES_IN
      ? parseInt(process.env.JWT_REFRESH_EXPIRES_IN)
      : 8600,

    tokenAudience: process.env.JWT_AUDIENCE,
    tokenIssuer: process.env.JWT_ISSUER,
  };
});
