import { Test, TestingModule } from '@nestjs/testing';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';

describe('MailController', () => {
  let mailController: MailController;
  const mockMailService={}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailController],
      providers:[MailService]
    }).overrideProvider(MailService).useValue(mockMailService).compile();

    mailController = module.get<MailController>(MailController);
  });

  it('should be defined', () => {
    expect(mailController).toBeDefined();
  });
});
