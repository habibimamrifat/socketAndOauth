import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { userRoles } from '../../../common/enums/userRole.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'Habib',
    description: 'please provide the user name',
  })
  @IsString()
  name!: string;

  @ApiPropertyOptional({
    description: 'please provide the user profile picture',
  })
  @IsOptional()
  @IsString()
  img?: string;

  @ApiProperty({
    example: 'habibrifatx21@gmail.com',
    description: 'user email must be provided',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    enum: userRoles,
    example: userRoles.BACHELOR,
  })
  @IsEnum(userRoles)
  role!: userRoles;

  @ApiPropertyOptional({
    description: 'the property must be provided if not logged in by google',
    example: '123456',
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsString()
  googleId?: string;
}
