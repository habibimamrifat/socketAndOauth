import { registerAs } from '@nestjs/config';

export const EmailEnvConfig = registerAs('mail', () => ({
  companyEmail: process.env.EMAIL,
  appPassword: process.env.APP_PASSWORD,
}));
