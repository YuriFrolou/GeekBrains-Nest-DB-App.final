import {IsNumberString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CalcDataDto {
    @ApiProperty({example:1,description:'Первое число'})
    @IsNumberString()
    x: number;

    @ApiProperty({example:3,description:'Второе число'})
    @IsNumberString()
    y: number;
}
