import { Test, TestingModule } from '@nestjs/testing';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { NewsEntity } from '../entities/news.entity';
import { CreateNewsDto } from '../dto/create-news.dto';
import { UpdateNewsDto } from '../dto/update-news.dto';

describe('NewsController', () => {
  let newsController: NewsController;

  const news: NewsEntity[] = [];
  const newsDto: CreateNewsDto = {
    title: 'News',
    description: 'This is a news',
    userId:1,
    categoryId:1
  };
  const newsCreated: NewsEntity = {
    id: 1,
    title: 'News',
    description: 'This is',
    cover: 'https://termosfera.su/wp-content/uploads/2022/04/2816616767_vubrbej.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    user:null,
    category:null,
    comments:null
  };


  const mockNewsService = {
    findAll:jest.fn(()=>(news)),
    createNews: jest.fn(dto => {
      const _news={
        ...dto,
        cover: 'https://termosfera.su/wp-content/uploads/2022/04/2816616767_vubrbej.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      news.push(_news);
      return _news;
    }),
    update: jest.fn().mockImplementation((id, dto) => ({ id, ...newsCreated, ...dto})),
    remove: jest.fn().mockImplementation(id => {
      news.slice(id,1);
      return news;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsController],
      providers: [NewsService],
    }).overrideProvider(NewsService).useValue(mockNewsService).compile();

    newsController = module.get<NewsController>(NewsController);
  });

  it('should be defined', () => {
    expect(newsController).toBeDefined();
  });
  it('should create news', () => {
    expect(newsController.create(newsDto)).toEqual(Promise.resolve(newsCreated));
    expect(mockNewsService.createNews).toHaveBeenCalledWith(newsDto);
  });
  it('should update news', async () => {
    const dto: UpdateNewsDto = { title: 'updated news' };
    expect(newsController.update(1, dto)).toEqual(Promise.resolve({ ...newsCreated, ...dto }));
  });
  it('should delete news', async () => {
    expect(newsController.remove(1)).toEqual(Promise.resolve(news));
  });
  it('should get all news', async () => {
    expect(newsController.findAll()).toEqual(Promise.resolve(news));
  });
});

