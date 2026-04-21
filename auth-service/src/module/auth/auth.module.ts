import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { HashingImportModule } from '../../common/helpers/hashing/hashing.module';
import { jwtCustomModule } from '../../common/helpers/jwt/jwtCustom.module';
import { OauthModule } from './oauth/oauth.module';

@Module({
  imports: [HashingImportModule, jwtCustomModule, OauthModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
