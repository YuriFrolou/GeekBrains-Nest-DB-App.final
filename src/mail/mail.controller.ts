import { Controller, Get} from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NewsEntity } from '../entities/news.entity';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get()
  @ApiOperation({summary:'Send test email'})
  @ApiResponse({
    status: 200,
    description: 'send rest email'
  })
  async sendTestEmail() {
    return this.mailService.sendTest();
  }

}
