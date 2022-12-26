import { Test, TestingModule } from '@nestjs/testing';
import { NewsService } from './news.service';
import { UsersService } from '../users/users.service';
import { UsersEntity } from '../entities/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NewsEntity } from '../entities/news.entity';
import { MailService } from '../mail/mail.service';
import { CategoriesService } from './categories/categories.service';
import { CreateNewsDto } from '../dto/create-news.dto';
import { Role } from '../auth/role/role.enum';
import { CategoriesEntity } from '../entities/category.entity';
import { UpdateNewsDto } from '../dto/update-news.dto';

const userCreated: UsersEntity = {
  id: 1,
  firstName: 'Sergey',
  lastName: 'Kononchuk',
  email: 'serg@mail.ru',
  password: expect.any(String),
  roles: Role.User,
  cover: 'https://termosfera.su/wp-content/uploads/2022/04/2816616767_vubrbej.jpg',
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date),
};
const categoryCreated: CategoriesEntity = {
  id: 1,
  name: 'cats',
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date)
};
const newsDto: CreateNewsDto = {
  title: 'News',
  description: 'This is a news',
  cover: 'https://termosfera.su/wp-content/uploads/2022/04/2816616767_vubrbej.jpg',
  userId: 1,
  categoryId: 1,
};

const newsCreated: NewsEntity = {
  id: 1,
  title: 'News',
  description: 'This is a news',
  cover: expect.any(String),
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date)
};

const example:any={
  id: 1,
  title: 'News',
  description: 'This is a news',
  cover: expect.any(String),
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date),
  user:{
    id: 1,
    firstName: 'Sergey',
    lastName: 'Kononchuk',
    email: 'serg@mail.ru',
    password: expect.any(String),
    roles: Role.User,
    cover: 'https://termosfera.su/wp-content/uploads/2022/04/2816616767_vubrbej.jpg',
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
  },
  category:{
    id: 1,
    name: 'cats',
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date)
  }
}

const news: Array<NewsEntity> = [{
  ...example,
  id: 1,
}];

describe('NewsService', () => {
  let newsService: NewsService;
  let usersService: UsersService;
  let mailService: MailService;
  let categoriesService: CategoriesService;
  const mockNewsRepository = {
    save: jest.fn().mockImplementation(async (news) => Promise.resolve({
      id: expect.any(Number), ...news, createdAt: new Date(),
      updatedAt: new Date(),
    })),
    find: jest.fn().mockImplementation(async () => Promise.resolve(news)),
    findOne: jest.fn().mockImplementation((id: number) => Promise.resolve({ id, ...example })),
    findOneBy: jest.fn().mockImplementation((id: number) => Promise.resolve({ id, ...newsCreated })),
    remove: jest.fn().mockImplementation((id: number) => {
      news.slice(id, 1);
      Promise.resolve({ id, ...example });
    }),
  };

  const mockUsersService = {
    getUserById: jest.fn().mockImplementation((id: number) => Promise.resolve({ id, ...userCreated })),
  };
  const mockCategoriesService = {
    findOne: jest.fn().mockImplementation((id: number) => Promise.resolve({ id, ...categoryCreated })),
  };
  const mockMailService = {
    updateNewsLogMessage: jest.fn().mockImplementation((str,[param1,param2]) => Promise.resolve(true)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewsService, UsersService, CategoriesService, MailService,
        {
          provide: getRepositoryToken(NewsEntity),
          useValue: mockNewsRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    newsService = module.get<NewsService>(NewsService);
    usersService = module.get<UsersService>(UsersService);
    categoriesService = module.get<CategoriesService>(CategoriesService);
    mailService = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(newsService).toBeDefined();
  });
  it('should create and save new news', async () => {
    expect(await newsService.createNews(newsDto)).toEqual(example);
  });
  it('should get all news', async () => {
    expect(await newsService.findAll()).toEqual(news);
  });
  it('should get news by id', async () => {
    expect(await newsService.findOneById(1)).toEqual(example);
  });
  it('should update news by id', async () => {
    const dto: UpdateNewsDto = { title: 'updated news' };
    const changedNews={...newsCreated,...dto};
    expect(await newsService.update(1,dto)).toEqual({ ...example,...dto});
      });
  it('should delete news by id', async () => {
    expect(await newsService.remove(1)).toEqual(news);
  });
});


