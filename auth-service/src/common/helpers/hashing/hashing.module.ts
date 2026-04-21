import { Module } from '@nestjs/common';
import { HashAbstract } from './hashAbstract';
import { BcryptHashService } from './bcryptHashing';

@Module({
  providers: [
    {
      provide: HashAbstract,
      useClass: BcryptHashService,
    },
  ],
  exports: [HashAbstract],
})
export class HashingImportModule {}
