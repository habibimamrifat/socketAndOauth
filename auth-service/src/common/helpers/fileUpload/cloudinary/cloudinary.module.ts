import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_PROVIDER_KEY } from '../../../const/cloudinaryKey.const';
import { CloudinaryService } from './cloudinary.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: CLOUDINARY_PROVIDER_KEY,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        cloudinary.config({
          cloud_name: config.get<string>('cloudinary.cloudName'),
          api_key: config.get<string>('cloudinary.cloudApiKey'),
          api_secret: config.get<string>('cloudinary.cloudApiSecret'),
        });

        return cloudinary;
      },
    },
    CloudinaryService,
  ],
  exports: [CLOUDINARY_PROVIDER_KEY, CloudinaryService],
})
export class CloudinaryModule {}
