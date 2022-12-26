import { IsArray, IsInt, IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

export class CreateCommentDto {
    @ApiPropertyOptional({example:1,description:'Идентификатор комментария'})
    @IsInt()
    @IsOptional()
    id?: number;

    @ApiProperty({example:"Комментарий",description:'Содержание комментария'})
    @IsString({
        message: 'Поле message должно быть строкой'
    })
    @IsNotEmpty()
    message: string;

    @ApiPropertyOptional({type:String})
    @IsString()
    @IsOptional()
    cover?: string;

    @ApiProperty({example:'3',description:'Уникальный идентификатор новости - внешний ключ'})
    @IsNumberString()
    @IsOptional()
    newsId: number;

    @ApiProperty({example:'2',description:'Уникальный идентификатор пользователя - внешний ключ'})
    @IsNumberString()
    userId: number;
}

export type Comments = Record<string | number, CreateCommentDto[]>;