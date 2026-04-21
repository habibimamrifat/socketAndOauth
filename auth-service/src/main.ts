import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerHelperService } from './common/helpers/swagger/swaggerHelper.service';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { RemovePasswordInterceptor } from './common/interceptor/remove-password.interceptor';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SwaggerHelperService.setup(app);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // 🔥 enables class-transformer
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new RemovePasswordInterceptor());

  app.use(cookieParser());
  // main.ts
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);

  console.log(
    'auth service is running on port ==>>',
    process.env.PORT || '3000',
  );
  console.log('env used ==>>', process.env.NODE_ENV);
}
bootstrap();
