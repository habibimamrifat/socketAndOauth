import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtServiceCustom } from './jwtCustom.service';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.accessToken'),
        signOptions: {
          expiresIn: config.get<number>('jwt.accessTokenExpireIN'),
          audience: config.get<string>('jwt.tokenAudience'),
          issuer: config.get<string>('jwt.tokenIssuer'),
        },
      }),
    }),
  ],

  providers: [JwtServiceCustom],
  exports: [JwtServiceCustom],
})
export class jwtCustomModule {}
