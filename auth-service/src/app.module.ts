import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './module/users/user.module';
import { PrismaModule } from './module/prisma/prisma.module';
import { ConfigImportModule } from './common/mods/ConfigImport.module';
import { AuthModule } from './module/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessGuard } from './common/guards/access.guard';
import { AuthenticGuard } from './common/guards/authentic.guard';
import { CloudinaryModule } from './common/helpers/fileUpload/cloudinary/cloudinary.module';
import { MailCustomModule } from './common/helpers/mailsystem/mail.module';
import { ChatGateway } from './module/chat/chat.gateway';

@Module({
  imports: [
    ConfigImportModule,
    UserModule,
    PrismaModule,
    AuthModule,
    CloudinaryModule,
    MailCustomModule,
    MailCustomModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AccessGuard,
    },
    AuthenticGuard,
    ChatGateway,
  ],
})
export class AppModule {}
