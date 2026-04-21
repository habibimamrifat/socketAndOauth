import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { routeType } from '../enums/routeType.enum';
import { JwtPayload } from '../types/jwtPayload.type';
import { PrismaService } from '../../module/prisma/prisma.service';
import { AuthenticGuard } from './authentic.guard';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authenticGuard: AuthenticGuard,
    private readonly prisma: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const accessTo = this.reflector.getAllAndOverride('access', [
      context.getHandler(),
      context.getClass(),
    ]) || [routeType.TOKEN];

    const request = context.switchToHttp().getRequest();

    if (accessTo.includes(routeType.PUBLIC)) {
      return true;
    }

    this.authenticGuard.canActivate(context);

    const user = request.user as JwtPayload;

    const findUser = await this.prisma.user.findUnique({
      where: {
        id: user.sub,
      },
    });

    if (!accessTo.includes(findUser?.role)) {
      throw new UnauthorizedException('your role can not access this route');
    }
    console.log('access guard ===>>>', accessTo);
    return true;
  }
}
