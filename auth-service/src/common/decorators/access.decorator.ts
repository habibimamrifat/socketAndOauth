import { SetMetadata } from '@nestjs/common';
import { routeType } from '../enums/routeType.enum';
import { routeAccessTo } from '../types/routeAccessTo.type';

export const AccessTo = (...accessTo: routeAccessTo[]) => {
  if (accessTo.includes(routeType.PUBLIC)) {
    return SetMetadata('access', [routeType.PUBLIC]);
  }
  return SetMetadata('access', accessTo);
};
