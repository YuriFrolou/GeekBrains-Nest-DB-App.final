import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { NewsEntity } from '../../entities/news.entity';
import { CreateNewsDto } from '../../dto/create-news.dto';
import { CommentsEntity } from '../../entities/comments.entity';
import { CreateCommentDto } from '../../dto/create-comment.dto';
import { UpdateNewsDto } from '../../dto/update-news.dto';
import * as mocks from 'node-mocks-http';
import { UpdateCommentDto } from '../../dto/update-comment.dto';


describe('CommentsController', () => {
  let commentsController: CommentsController;
  const req = mocks.createRequest({
    user: {
      userId: 1,
    },
  });
  const comments: CommentsEntity[] = [];
  const commentsDto: CreateCommentDto = {
    message: 'Comment',
    newsId:1,
    userId:1,
  };
  const commentCreated: CommentsEntity = {
    id: 1,
    message: 'Comment',
    createdAt: new Date(),
    updatedAt: new Date(),
    user:null,
    news:null
  };


  const mockCommentsService = {
    findAll:jest.fn(()=>(comments)),
    create: jest.fn(dto => {
      const _comment={
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      comments.push(_comment);
      return _comment;
    }),
    update: jest.fn().mockImplementation((id, dto) => ({ id, ...commentCreated, ...dto})),
    remove: jest.fn().mockImplementation(id => {
      comments.slice(id,1);
      return comments;
    }),
  };

  beforeEach(async () => {

    const commentsModule: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers:[CommentsService]
    }).overrideProvider(CommentsService).useValue(mockCommentsService).compile();


    commentsController = commentsModule.get<CommentsController>(CommentsController);
  });

  it('should be defined', () => {
    expect(commentsController).toBeDefined();
  });
  it('should create comment', () => {
    expect(commentsController.create(commentsDto,req)).toEqual(Promise.resolve(commentCreated));
    expect(mockCommentsService.create).toHaveBeenCalled();
  });
  it('should update comment', async () => {
    const dto: UpdateCommentDto = { message: 'updated comment' };
    expect(commentsController.update(1, dto)).toEqual(Promise.resolve({ ...commentCreated, ...dto }));
  });
  it('should delete comment', async () => {
    expect(commentsController.remove(1,req)).toEqual(Promise.resolve(comments));
  });
  it('should get all comments', async () => {
    expect(commentsController.findAll(1)).toEqual(Promise.resolve(comments));
  });
});
