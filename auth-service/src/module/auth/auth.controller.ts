import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { LogInDto } from './dto/loogIn.dto';
import { AccessTo } from '../../common/decorators/access.decorator';
import { routeType } from '../../common/enums/routeType.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/log-in')
  @AccessTo(routeType.PUBLIC)
  logIn(@Body() payload: LogInDto) {
    return this.authService.logIn(payload);
  }
}
