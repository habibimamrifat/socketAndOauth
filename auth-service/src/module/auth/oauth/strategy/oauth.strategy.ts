import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { OauthService } from '../oauth.service';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { OauthUser } from '../../../../common/types/oAuth.type';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly oauthService: OauthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('oauth.googleId')!,
      clientSecret: configService.get<string>('oauth.googleClientSecret')!,
      callbackURL: 'http://localhost:3000/oauth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: any) {
    const userdata: OauthUser = {
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      img: profile.photos[0]?.value || 'no image to show',
    };
    return userdata;
  }
}
