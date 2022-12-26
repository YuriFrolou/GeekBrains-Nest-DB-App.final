import { IsArray, IsInt, IsNumberString, IsOptional, IsString } from 'class-validator';
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import { CreateCommentDto } from './create-comment.dto';

export class CreateNewsDto {

    @ApiProperty({example:"Новость",description:'Заголовок новости'})
    @IsString()
    title: string;

    @ApiProperty({example:"Содержание новости",description:'Это текст новости'})
    @IsString({
        message:'Поле description должно быть строкой'
    })
    description: string;

    @ApiPropertyOptional({example:"https://termosfera.su/wp-content/uploads/2022/04/2816616767_vubrbej.jpg",description:'Обложка новости'})
    @IsString()
    @IsOptional()
    cover?: string;

    @ApiPropertyOptional()
    @IsArray()
    @IsOptional()
    comments?: CreateCommentDto[];


    @ApiProperty({example:'2',description:'Уникальный идентификатор пользователя - внешний ключ'})
    @IsNumberString()
    userId: number;


    @ApiProperty({example:'2',description:'Уникальный идентификатор категории - внешний ключ'})
    @IsNumberString()
    categoryId: number;
}

export type NewsCreate=Record<string|number,CreateNewsDto>;