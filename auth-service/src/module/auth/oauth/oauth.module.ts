import { Module } from '@nestjs/common';
import { OauthController } from './oauth.controller';
import { OauthService } from './oauth.service';
import { GoogleStrategy } from './strategy/oauth.strategy';
import { jwtCustomModule } from '../../../common/helpers/jwt/jwtCustom.module';

@Module({
  imports: [jwtCustomModule],
  controllers: [OauthController],
  providers: [OauthService, GoogleStrategy],
})
export class OauthModule {}
