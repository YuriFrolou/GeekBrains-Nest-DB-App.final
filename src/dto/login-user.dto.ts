import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    example:"example@mail.ru",
    description:'Email пользователя'
  })
  @IsEmail()
  username: string;

  @ApiProperty({
    example:"22222",
    description:'Пароль пользователя'
  })
  @IsString()
  password: string;

}

