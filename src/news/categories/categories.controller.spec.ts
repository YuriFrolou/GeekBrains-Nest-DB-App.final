import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

describe('CategoriesController', () => {
  let categoriesController: CategoriesController;
  const mockCategoriesService={}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [CategoriesService],
    }).overrideProvider(CategoriesService).useValue(mockCategoriesService).compile();

    categoriesController = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(categoriesController).toBeDefined();
  });
});
