import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtServiceCustom } from '../helpers/jwt/jwtCustom.service';
import { JwtPayload } from '../types/jwtPayload.type';

@Injectable()
export class AuthenticGuard implements CanActivate {
  constructor(private jwtService: JwtServiceCustom) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const requestAuthorization = request.headers['authorization'];

    if (!requestAuthorization) {
      throw new Error('the token is not found');
    }
    const [bearer, token] = requestAuthorization.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new Error('the token is not constructed properly');
    }

    const payload = this.jwtService.verifyAccessToken(token as string);

    if (!payload) {
      throw new Error('some thing went wrong during verifying the jwt');
    }

    request['user'] = payload as JwtPayload;

    return true;
  }
}
