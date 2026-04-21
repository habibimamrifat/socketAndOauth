import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LogInDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'haibrifatx21gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Password of the user',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
