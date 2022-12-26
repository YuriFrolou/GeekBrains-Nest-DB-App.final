import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {IsInt, IsOptional, IsString} from "class-validator";

export class UpdateNewsDto {
    @ApiPropertyOptional({ example: 'Новая новость', description: 'Новый заголовок новости' })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiPropertyOptional({ example: 'Новость изменена', description: 'Новый текст новости' })
    @IsString({
        message:'Поле description должно быть строкой'
    })
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({type:String})
    @IsString()
    @IsOptional()
    author?: string;

}
