import { IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Role } from '../auth/role/role.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {

  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @MinLength(2)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @ApiPropertyOptional({type:String})
  @IsString()
  @IsOptional()
  cover?: string;

  @IsEnum(Role)
  role:Role

}

