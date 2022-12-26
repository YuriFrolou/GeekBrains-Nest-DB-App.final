import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersEntity } from '../../entities/users.entity';
import { CommentsEntity } from '../../entities/comments.entity';
import { NewsService } from '../news.service';
import { UsersService } from '../../users/users.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Role } from '../../auth/role/role.enum';
import { CategoriesEntity } from '../../entities/category.entity';
import { CreateNewsDto } from '../../dto/create-news.dto';
import { NewsEntity } from '../../entities/news.entity';
import { MailService } from '../../mail/mail.service';
import { CategoriesService } from '../categories/categories.service';
import { CreateCommentDto } from '../../dto/create-comment.dto';
import { UpdateNewsDto } from '../../dto/update-news.dto';
import { UpdateCommentDto } from '../../dto/update-comment.dto';

describe('CommentsService', () => {
  let commentsService: CommentsService;
  let newsService: NewsService;
  let usersService: UsersService;
  let eventEmitter: EventEmitter2;


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

  const commentDto: CreateCommentDto = {
    message: 'Comment',
    newsId: 1,
    userId: 1,
  };
  const commentCreated: CommentsEntity = {
    id: 1,
    message: expect.any(String),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const newsCreated: NewsEntity = {
    id: 1,
    title: 'News',
    description: 'This is a news',
    cover: expect.any(String),
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
  };

  const example: any = {
    id: 1,
    message: 'Comment',
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
    user: {
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
    news: {
      id: 1,
      title: 'News',
      description: 'This is a news',
      cover: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    },
  };

  const comments: Array<CommentsEntity> = [{
    ...example,
    id: 1,
  }];

  const mockCommentsRepository = {
    save: jest.fn().mockImplementation(async (comment) => Promise.resolve({
      id: expect.any(Number), ...comment, createdAt: new Date(),
      updatedAt: new Date(),
    })),
    find: jest.fn().mockImplementation(async () => Promise.resolve(comments)),
    findOne: jest.fn().mockImplementation((id: number) => Promise.resolve({ id, ...example})),
    findOneBy: jest.fn().mockImplementation((id: number) => Promise.resolve({ id, ...commentCreated })),
    remove: jest.fn().mockImplementation((id: number) => {
      comments.slice(id, 1);
      Promise.resolve({ id, ...example });
    }),
  };

  const mockUsersService = {
    getUserById: jest.fn().mockImplementation((id: number) => Promise.resolve({ id, ...userCreated })),
  };
  const mockNewsService = {
    findOneById: jest.fn().mockImplementation((id: number) => Promise.resolve({ id, ...newsCreated })),
  };
  const mockEventEmitter = {
    emit: jest.fn().mockImplementation((str:String,obj:Object) => Promise.resolve(true)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentsService, NewsService, UsersService, EventEmitter2,
        {
          provide: getRepositoryToken(CommentsEntity),
          useValue: mockCommentsRepository,
        },
        {
          provide: NewsService,
          useValue: mockNewsService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    commentsService = module.get<CommentsService>(CommentsService);
    newsService = module.get<NewsService>(NewsService);
    usersService = module.get<UsersService>(UsersService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(commentsService).toBeDefined();
  });
  it('should create and save new comment', async () => {
    expect(await commentsService.create(1,commentDto.message,1)).toEqual(example);
  });
  it('should get all comments', async () => {
    expect(await commentsService.findAll(1)).toEqual(comments);
  });
  it('should get comment by id', async () => {
    expect(await commentsService.findOne(1)).toEqual(example);
  });
  it('should update comment by id', async () => {
    const dto: UpdateCommentDto = { message: 'updated comment' };
    expect(await commentsService.update(1,dto.message)).toEqual({ ...commentCreated});
  });
  it('should delete comment by id', async () => {
    expect(await commentsService.remove(1,1)).toEqual(comments);
  });
});
