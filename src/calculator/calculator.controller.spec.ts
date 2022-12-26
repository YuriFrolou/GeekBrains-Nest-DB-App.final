import { Test, TestingModule } from '@nestjs/testing';
import { CalculatorController } from './calculator.controller';
import { CalculatorService } from './calculator.service';
import * as mocks from 'node-mocks-http';
import { CalcDataDto } from '../dto/calc-data.dto';


describe('CalculatorController', () => {
  let controller: CalculatorController;
  let service: CalculatorService;
  const req:any = mocks.createRequest();
  req.headers['custom-type-operation']='plus';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CalculatorController],
      providers:[CalculatorService]
    }).compile();

    controller = module.get<CalculatorController>(CalculatorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should return plus result', () => {
    const query:CalcDataDto={
      x:2,
      y:3
    }
    expect(controller.calculate(query,req)).toBe(5);
  });
});
