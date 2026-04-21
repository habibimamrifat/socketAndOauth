import { Inject, Injectable } from '@nestjs/common';
import { CLOUDINARY_PROVIDER_KEY } from '../../../const/cloudinaryKey.const';
import { v2 as Cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject(CLOUDINARY_PROVIDER_KEY)
    private cloudinary: typeof Cloudinary,
  ) {}

  private uploadToCloudinary(buffer: Buffer): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      console.log('UPLOAD STARTED');
      console.log('BUFFER SIZE:', buffer?.length);
      // console.log(this.cloudinary.config());

      const stream = this.cloudinary.uploader.upload_stream(
        { folder: 'uploads', resource_type: 'auto' },
        (error, result) => {
          console.log('CALLBACK TRIGGERED'); // 🔥 IMPORTANT

          if (error) {
            console.log('ERROR:', error);
            reject(new Error('Upload failed'));
          }

          if (!result) {
            console.log('NO RESULT');
            return reject(new Error('No result'));
          }

          console.log('SUCCESS:', result.secure_url);
          resolve(result);
        },
      );

      stream.on('error', (err) => {
        console.log('STREAM ERROR:', err);
        reject(err);
      });

      stream.end(buffer);
    });
  }

  async uploadFile(file: Express.Multer.File) {
    console.log(file.buffer);
    return this.uploadToCloudinary(file.buffer);
  }
}
