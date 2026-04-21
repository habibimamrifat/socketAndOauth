import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './provider/user.service';
import { CreateUserDto } from './dtos/createUser.dto';
import { AccessTo } from '../../common/decorators/access.decorator';
// import { routeType } from '../../common/enums/routeType.enum';
import { userRoles } from '../../common/enums/userRole.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { routeType } from '../../common/enums/routeType.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(FileInterceptor('file'))
  @AccessTo(routeType.PUBLIC)
  @Post('/createUser')
  createUserWithEmailPassword(
    @Body() payload: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.createUserWithEmailPassword(payload, file);
  }

  @Get('/find-all-users')
  @AccessTo(userRoles.HOTEL_OWNER, userRoles.HOME_OWNER, userRoles.BACHELOR)
  findAllUser() {
    return this.userService.findAllUser();
  }
}
