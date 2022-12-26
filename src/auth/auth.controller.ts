import { Controller, Post, Request, Res, UseGuards} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import {Response} from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NewsEntity } from '../entities/news.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService:AuthService) {
  }

  @UseGuards(LocalAuthGuard)
  @ApiOperation({summary:'Delete news'})
  @ApiResponse({
    status: 200,
    description: 'Login user',
    type: String,
  })
  @Post('login')
  async login(@Request() req, @Res({passthrough:true}) response:Response) {
    const{accessToken,id}=await this.authService.login(req.user);
    response.cookie('authorization',accessToken.toString());
    response.cookie('userId',id);
    return accessToken;
  }
}
