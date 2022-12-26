import { Controller, Post, Request, Res, UseGuards} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import {Response} from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService:AuthService) {
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({passthrough:true}) response:Response) {
    const{accessToken,id}=await this.authService.login(req.user);
    response.cookie('authorization',accessToken.toString());
    response.cookie('userId',id);
    return accessToken;
  }
}
