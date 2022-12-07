import { Controller, Get, Render, UseGuards,Request } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get()
  @Render('index')
  getHello() {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile') getProfile(@Request() req) {
    return req.user;
  }
}
