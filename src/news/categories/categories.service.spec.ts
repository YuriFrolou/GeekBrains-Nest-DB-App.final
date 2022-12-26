import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommentsEntity } from '../../entities/comments.entity';
import { CategoriesEntity } from '../../entities/category.entity';

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;
 const mockCategoriesRepository={}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriesService,
        {
          provide: getRepositoryToken(CategoriesEntity),
          useValue: mockCategoriesRepository,
        },],
    }).compile();

    categoriesService = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(categoriesService).toBeDefined();
  });
});
