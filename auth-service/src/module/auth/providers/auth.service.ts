import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LogInDto } from '../dto/loogIn.dto';
import { HashAbstract } from '../../../common/helpers/hashing/hashAbstract';
import { JwtServiceCustom } from '../../../common/helpers/jwt/jwtCustom.service';
import { sendResponse } from '../../../common/helpers/responseSender/reaponseHelper';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashAbstract: HashAbstract,
    private readonly jwtService: JwtServiceCustom,
  ) {}

  public async logIn(payload: LogInDto) {
    console.log('i am from log in service ===>>>>');
    const user = await this.prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    // console.log('===>>> ', user);

    if (!user?.password) {
      throw new BadRequestException(
        'the password is not hashed in the databse you may try google log in',
      );
    }

    const matchPassword = await this.hashAbstract.matchHash(
      payload.password,
      user.password,
    );

    // console.log('match password=>>', matchPassword);

    if (!matchPassword) {
      throw new BadRequestException('the password is not matched');
    }

    const accessToken = this.jwtService.generateAccessToken({
      sub: user.id,
      role: user.role,
    });
    const refreshToken = this.jwtService.generateRefreshToken({
      sub: user.id,
      role: user.role,
    });

    const data = {
      ...user,
      accessToken,
      refreshToken,
    };

    // console.log('data ====>>>', data);

    return sendResponse({
      success: true,
      statusCode: HttpStatus.OK,
      message: 'log In Successful',
      data: data,
    });
  }
}
