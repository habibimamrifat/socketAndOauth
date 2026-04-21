import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';

@Injectable()
export class JwtServiceCustom {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessExpiresIn: StringValue;
  private readonly refreshExpiresIn: StringValue;
  private readonly issuer: string;
  private readonly audience: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {
    // ✅ Grab all values
    const accessSecret = this.config.get<string>('jwt.accessToken');
    const refreshSecret = this.config.get<string>('jwt.refreshTokenSecret');
    const accessExpiresIn = this.config.get<string>('jwt.accessTokenExpireIN');
    const refreshExpiresIn = this.config.get<string>(
      'jwt.refreshTokenExpireIn',
    );
    const issuer = this.config.get<string>('jwt.tokenIssuer');
    const audience = this.config.get<string>('jwt.tokenAudience');

    // ✅ Validate (keep your pattern)
    if (
      !accessSecret ||
      !refreshSecret ||
      !accessExpiresIn ||
      !refreshExpiresIn ||
      !issuer ||
      !audience
    ) {
      throw new Error(
        'JWT configuration missing: ' +
          [
            !accessSecret && 'accessSecret',
            !refreshSecret && 'refreshSecret',
            !accessExpiresIn && 'accessExpiresIn',
            !refreshExpiresIn && 'refreshExpiresIn',
            !issuer && 'issuer',
            !audience && 'audience',
          ]
            .filter(Boolean)
            .join(', '),
      );
    }

    // ✅ Assign (with correct typing)
    this.accessSecret = accessSecret;
    this.refreshSecret = refreshSecret;
    this.accessExpiresIn = accessExpiresIn as StringValue;
    this.refreshExpiresIn = refreshExpiresIn as StringValue;
    this.issuer = issuer;
    this.audience = audience;
  }

  generateAccessToken(payload: Record<string, any>): string {
    return this.jwtService.sign(payload, {
      secret: this.accessSecret,
      expiresIn: this.accessExpiresIn,
      issuer: this.issuer,
      audience: this.audience,
    });
  }

  generateRefreshToken(payload: Record<string, any>): string {
    return this.jwtService.sign(payload, {
      secret: this.refreshSecret,
      expiresIn: this.refreshExpiresIn,
      issuer: this.issuer,
      audience: this.audience,
    });
  }

  verifyAccessToken<T = any>(token: string): T {
    return this.jwtService.verify(token, {
      secret: this.accessSecret,
      issuer: this.issuer,
      audience: this.audience,
    }) as T;
  }

  verifyRefreshToken<T = any>(token: string): T {
    return this.jwtService.verify(token, {
      secret: this.refreshSecret,
      issuer: this.issuer,
      audience: this.audience,
    }) as T;
  }
}
