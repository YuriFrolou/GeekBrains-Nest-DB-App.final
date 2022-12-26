import { Test, TestingModule } from '@nestjs/testing';
import { CalculatorService } from './calculator.service';

describe('CalculatorService', () => {
  let service: CalculatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalculatorService],
    }).compile();

    service = module.get<CalculatorService>(CalculatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should return plus result', () => {
    expect(service.calculate('plus',2,3)).toBe(5);
  });
  it('should return plus result', () => {
    expect(service.calculate('minus',2,3)).toBe(-1);
  });
  it('should return plus result', () => {
    expect(service.calculate('multiply',2,3)).toBe(6);
  });
  it('should return plus result', () => {
    expect(service.calculate('',2,3)).toBe('Не удалось выполнить операцию. Проверьте параметры запроса');
  });
});
