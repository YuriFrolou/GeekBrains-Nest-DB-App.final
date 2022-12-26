import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsController } from './news/news.controller';
import { NewsService } from './news/news.service';
import { CalculatorModule } from './calculator/calculator.module';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });


  describe('root', () => {
    it('should be defined', () => {
      expect(appController).toBeDefined();
    });
    it('should return "Hello!!!"', () => {
      expect(appController.getHello()).toStrictEqual({message:'Hello!!!'});
    });
  });
});
