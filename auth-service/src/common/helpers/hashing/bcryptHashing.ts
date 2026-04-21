import { Injectable } from '@nestjs/common';
import { HashAbstract } from './hashAbstract';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptHashService extends HashAbstract {
  async createHash(plainPassword: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    return hashedPassword;
  }

  async matchHash(
    plainPassword: string,
    hashedPasswordDB: string,
  ): Promise<boolean> {
    const isMatched = await bcrypt.compare(plainPassword, hashedPasswordDB);
    return isMatched;
  }
}
