import 'express';
import 'multer';
import { JwtPayload } from './jwtPayload.type';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      cookies?: Record<string, any>;
    }
  }
}
