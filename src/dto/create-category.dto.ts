import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({example:'Cats',description:'Название категории'})
  @IsString()
  name: string;
}


