import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class RemovePasswordInterceptor<T = any> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const request = context.switchToHttp().getRequest();
    // console.log('from remove password interceptor ==>>', request);
    return next.handle().pipe(
      map((data) => {
        if (data?.data?.password) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, googleId, ...rest } = data.data;
          return { ...data, data: rest } as T;
        } else return data as T;
      }),
    );
  }
}
