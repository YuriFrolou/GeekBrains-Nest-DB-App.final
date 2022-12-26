import { IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Role } from '../auth/role/role.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Иван', description: 'Имя пользователя' })
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty({ example: 'Сидоров', description: 'Фамилия пользователя' })
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiProperty({ example: 'example@mail.ru', description: 'Email пользователя' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '22222', description: 'Пароль пользователя' })
  @IsString()
  password: string;

  @ApiPropertyOptional({
    example: 'https://termosfera.su/wp-content/uploads/2022/04/2816616767_vubrbej.jpg',
    description: 'Аватар пользователя',
  })
  @IsString()
  @IsOptional()
  cover?: string;

  @ApiProperty({
    example: 'user',
    description: 'Роль пользователя',
  })
  @IsEnum(Role)
  role: Role;

}

