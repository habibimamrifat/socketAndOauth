import { userRoles } from '../enums/userRole.enum';

export type JwtPayload = {
  sub: string;
  role: userRoles;
};
