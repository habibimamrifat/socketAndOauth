import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OauthUser } from '../../../common/types/oAuth.type';
import { JwtServiceCustom } from '../../../common/helpers/jwt/jwtCustom.service';

@Injectable()
export class OauthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtCustomService: JwtServiceCustom,
  ) {}

  public async createOauthProfile(payload: OauthUser) {
    if (!payload) {
      throw new InternalServerErrorException(
        'Payload in OAuth service is empty',
      );
    }

    try {
      const existingUser = await this.prisma.user.findUnique({
        where: {
          email: payload.email,
        },
      });

      // ✅ NEW USER → TEMP TOKEN
      if (!existingUser) {
        const accessToken = this.jwtCustomService.generateAccessToken({
          oauth: true,
          status: 'pending',
          //   googleId: payload.id,
          email: payload.email,
          name: payload.name,
          img: payload?.img,
        });

        return {
          type: 'NEW_USER',
          accessToken, // ✅ FIXED NAME
          refreshToken: null, // optional (or omit)
        };
      }

      // ✅ EXISTING USER
      const accessToken = this.jwtCustomService.generateAccessToken({
        sub: existingUser.id,
        role: existingUser.role,
      });

      const refreshToken = this.jwtCustomService.generateRefreshToken({
        sub: existingUser.id,
        role: existingUser.role,
      });

      return {
        type: 'EXISTING_USER',
        accessToken,
        refreshToken,
      };
    } catch (error: any) {
      throw new InternalServerErrorException(
        error?.message || 'OAuth profile creation failed',
      );
    }
  }
}
