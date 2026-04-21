import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './provider/user.service';
import { HashingImportModule } from '../../common/helpers/hashing/hashing.module';

@Module({
  imports: [HashingImportModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
