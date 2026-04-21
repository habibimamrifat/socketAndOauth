import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccessTo } from '../../../common/decorators/access.decorator';
import { routeType } from '../../../common/enums/routeType.enum';
import { OauthService } from './oauth.service';
import { userRoles } from '../../../common/enums/userRole.enum';
import { JwtServiceCustom } from '../../../common/helpers/jwt/jwtCustom.service';
import { PrismaService } from '../../prisma/prisma.service';
import type { Request, Response } from 'express';
import { OauthUser } from '../../../common/types/oAuth.type';

@Controller('oauth')
export class OauthController {
  constructor(
    private readonly oauthService: OauthService,
    private readonly jwtCustomService: JwtServiceCustom,
    private readonly prisma: PrismaService,
  ) {}

  // ✅ STEP 1 → GOOGLE LOGIN
  @Get('/google')
  @AccessTo(routeType.PUBLIC)
  @UseGuards(AuthGuard('google'))
  googleLogIn() {}

  // ✅ STEP 2 → GOOGLE CALLBACK
  @Get('/google/callback')
  @AccessTo(routeType.PUBLIC)
  @UseGuards(AuthGuard('google'))
  async getUser(@Res() res: Response, @Req() req: Request) {
    const googleUser = req.user as OauthUser;

    if (!googleUser) {
      throw new BadRequestException('Google user not found');
    }

    const userState = await this.oauthService.createOauthProfile(googleUser);

    // ✅ NEW USER FLOW
    if (userState.type === 'NEW_USER') {
      res.cookie('accessToken', userState.accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      });

      return res.redirect('http://localhost:5173/select-role');
    }

    // ✅ EXISTING USER FLOW
    res
      .cookie('accessToken', userState.accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      })
      .cookie('refreshToken', userState.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      });

    return res.redirect('http://localhost:5173/success');
  }

  // ✅ STEP 3 → COMPLETE PROFILE
  @Post('/complete-profile')
  @AccessTo(routeType.PUBLIC)
  async completeProfile(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: { role: userRoles },
  ) {
    try {
      const token = req.cookies?.accessToken;

      if (!token) {
        throw new BadRequestException('No token found');
      }

      const decoded = this.jwtCustomService.verifyAccessToken(token);

      if (!decoded?.googleSignInStatus && decoded?.status !== 'pending') {
        throw new BadRequestException(
          'Invalid OAuth flow. Please start from Google sign-in.',
        );
      }

      if (!body.role || !Object.values(userRoles).includes(body.role)) {
        throw new BadRequestException('Valid role is required');
      }

      const existingUser = await this.prisma.user.findUnique({
        where: { email: decoded.email },
      });

      if (existingUser) {
        throw new BadRequestException('User with this email already exists');
      }

      // Create user
      const user = await this.prisma.user.create({
        data: {
          email: decoded.email,
          name: decoded.name,
          role: body.role,
        },
      });

      // Generate real tokens
      const accessToken = this.jwtCustomService.generateAccessToken({
        sub: user.id,
        role: user.role,
      });

      const refreshToken = this.jwtCustomService.generateRefreshToken({
        sub: user.id,
        role: user.role,
      });

      // Set cookies
      res
        .cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: false, // true in production
          sameSite: 'lax',
          path: '/',
          maxAge: 15 * 60 * 1000, // 15 min
        })
        .cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          path: '/',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

      // Return JSON instead of redirect
      return res.status(200).json({
        success: true,
        message: 'Profile completed successfully',
        redirectTo: 'http://localhost:5173/success',
      });
    } catch (error: any) {
      console.error('Complete Profile Error:', error);
      throw new BadRequestException(
        error.message || 'Failed to complete profile',
      );
    }
  }
}
