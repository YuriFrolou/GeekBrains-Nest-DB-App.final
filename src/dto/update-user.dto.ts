import { IsEmail, IsEnum, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'Иван', description: 'Имя пользователя' })
  @ValidateIf(o=>o.firstName)
  @IsString()
  @MinLength(2)
  firstName?: string;

  @ApiProperty({ example: 'Сидоров', description: 'Фамилия пользователя' })
  @ValidateIf(o=>o.lastName)
  @IsString()
  @MinLength(2)
  lastName?: string;

  @ApiProperty({ example: 'example@mail.ru', description: 'Email пользователя' })
  @ValidateIf(o=>o.email)
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '22222', description: 'Пароль пользователя' })
  @ValidateIf(o=>o.password)
  @IsString()
  password?: string;

  @ApiPropertyOptional({ example: 'https://termosfera.su/wp-content/uploads/2022/04/2816616767_vubrbej.jpg', description: 'Аватар пользователя' })
  @ValidateIf(o=>o.cover)
  @IsString()
  @IsOptional()
  cover?: string;

}
