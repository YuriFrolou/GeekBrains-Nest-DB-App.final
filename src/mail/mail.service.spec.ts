import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { UsersEntity } from '../entities/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { NewsService } from '../news/news.service';

describe('MailService', () => {
  let mailService: MailService;
  let mailerService: MailerService;
  const mockMailerService={}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService,
        {
          provide: MailerService,
          useValue: mockMailerService,
        },],
    }).compile();

    mailService = module.get<MailService>(MailService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(mailerService).toBeDefined();
  });
});


