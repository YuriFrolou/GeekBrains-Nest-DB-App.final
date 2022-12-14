import { forwardRef, HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from '../../dto/create-comment.dto';
import { UpdateCommentDto } from '../../dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsService } from '../news.service';
import { CommentsEntity } from '../../entities/comments.entity';
import { UsersService } from '../../users/users.service';
import { EventEmitter2 } from '@nestjs/event-emitter';


@Injectable()
export class CommentsService {

  constructor(@InjectRepository(CommentsEntity)
              private readonly commentRepository: Repository<CommentsEntity>,
              @Inject(forwardRef(() => NewsService))
              private readonly newsService: NewsService,
              private readonly usersService: UsersService,
              private readonly eventEmitter: EventEmitter2

  ) {
  }

  async create(newsId:number,message:string,userId:number):Promise<CommentsEntity> {
    const _news = await this.newsService.findOneById(newsId);
    const _user = await this.usersService.getUserById(userId);

    if (!_user) {
      throw new HttpException(
        'Не существует такого автора', HttpStatus.BAD_REQUEST,
      );
    }
    if (!_news) {
      throw new HttpException(
        'Не существует такой новости', HttpStatus.BAD_REQUEST,
      );
    }

    const comment = new CommentsEntity();
    comment.message = message;
    comment.createdAt = new Date();
    comment.updatedAt = new Date();
    comment.user = _user;
    comment.news = _news;

    return await this.commentRepository.save(comment);

  }


  async findAll(newsId: number):Promise<CommentsEntity[]> {
    return await this.commentRepository.find({
      where: {
        news: {
          id: newsId,
        },
      },
      relations: ['user'],
    });
  }

  async findAllWithUsers(newsId: number):Promise<CommentsEntity[]> {
    return await this.commentRepository.find({
      where: {
        news: {
          id: newsId,
        },
      },
      relations: ['user'],
      join: {
        alias: 'comments',
        leftJoinAndSelect: {
          user: 'comments.user',
        },
      },
    });
  }

  async findOne(id: number):Promise<CommentsEntity>  {
    const comment = await this.commentRepository.findOne({ where:{id} ,
      relations: ['news','user']
    });
    if (!comment) {
      throw new NotFoundException();
    }

    return comment;
  }

  async update(commentId: number, message:string):Promise<CommentsEntity>  {
    let _comment=await this.findOne(commentId);
    const updatedComment = {
      ..._comment,
      message: message ? message : _comment.message,
      updatedAt: new Date()
    };
    _comment=await this.commentRepository.save(updatedComment);
    this.eventEmitter.emit('comment.update', {
      commentId: _comment.id,
      newsId: _comment.news.id,
      comment:_comment
    });
    return this.commentRepository.findOneBy({id:commentId})
  }


  async remove(commentId: number):Promise<CommentsEntity> {
    const comment=await this.findOne(commentId);

    this.eventEmitter.emit('comment.remove', { commentId: comment.id,
      newsId: comment.news.id,
    });
    return await this.commentRepository.remove(comment);
  }
}
