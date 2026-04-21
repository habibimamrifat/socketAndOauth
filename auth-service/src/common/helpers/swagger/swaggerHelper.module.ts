import { Global, Module } from '@nestjs/common';
import { SwaggerHelperService } from './swaggerHelper.service';

@Global()
@Module({
  providers: [SwaggerHelperService],
  exports: [SwaggerHelperService],
})
export class SwaggerHelperModule {}
