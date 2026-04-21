import { registerAs } from '@nestjs/config';

export const cloudinaryEnvConfig = registerAs('cloudinary', () => {
  return {
    cloudName: process.env.CLOUDINARY_NAME,
    cloudApiKey: process.env.CLOUDINARY_API_KEY,
    cloudApiSecret: process.env.CLOUDINARY_API_SECRET,
  };
});
