import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { jwtEnvConfig } from '../envConfigs/jwtConfig';
import { oauthEnvConfig } from '../envConfigs/oauthConfig';
import { cloudinaryEnvConfig } from '../envConfigs/cloudinaryConfig';
import { EmailEnvConfig } from '../envConfigs/mailConfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}`,
        '.env.development',
        '.env',
      ],
      expandVariables: true,
      load: [jwtEnvConfig, oauthEnvConfig, cloudinaryEnvConfig, EmailEnvConfig],
    }),
  ],
})
export class ConfigImportModule {}
