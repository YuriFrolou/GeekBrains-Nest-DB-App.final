import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Render, Req,
  UploadedFile, UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCommentDto } from '../../dto/create-comment.dto';
import { UpdateCommentDto } from '../../dto/update-comment.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HelperFileLoad } from '../../utils/HelperFileLoad';
import { CommentsEntity } from '../../entities/comments.entity';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

const PATH_NEWS = '/static/';
HelperFileLoad.path = PATH_NEWS;

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary:'Create new comment'})
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({
    status: 201,
    description: 'create new comment',
    type:CommentsEntity
  })
  @UseInterceptors(FileInterceptor('cover', {
    storage: diskStorage({
      destination: HelperFileLoad.destinationPath,
      filename: HelperFileLoad.customFileName,
    }),
  }))
  async create(@Body() createCommentDto: CreateCommentDto, @Req() req, @UploadedFile()cover: Express.Multer.File=null):Promise<CommentsEntity>{
    const userId=req.user.userId;
    if (cover?.filename) {
      createCommentDto.cover = PATH_NEWS + cover.filename;
    } else {
      createCommentDto.cover = 'https://termosfera.su/wp-content/uploads/2022/04/2816616767_vubrbej.jpg';
    }
    return await this.commentsService.create(createCommentDto.newsId,createCommentDto.message,userId);

  }


  @Get('/:newsId')
  @ApiOperation({summary:'Get all comments by news id'})
  @ApiResponse({
    status: 200,
    description: 'get all comments by news id',
    type:[CommentsEntity]
  })
  async findAll(@Param('newsId') newsId: number):Promise<CommentsEntity[]> {
    return this.commentsService.findAll(newsId);

  }


  @Get('/all/:newsId')
  @ApiOperation({summary:'Render all comments by news id'})
  @ApiResponse({
    status: 200,
    description: 'render all comments by news id'
  })
  @Render('comments-list')
 async renderAll(@Param('newsId') newsId: number):Promise<Object> {
    const comments= await this.commentsService.findAllWithUsers(newsId);
    return {
      comments:comments
    }

  }

  @Get('/:newsId/:commentId')
  @ApiOperation({summary:'Get comment by newsId and commentId'})
  @ApiResponse({
    status: 200,
    description: 'get comment by newsId and commentId',
    type: CommentsEntity,
  })
  async findOne(@Param('commentId') commentId: number):Promise<CommentsEntity> {
    return await this.commentsService.findOne(commentId);
  }

  @Patch('/:commentId')
  @ApiOperation({summary:'Update comment'})
  @ApiBody({ type: UpdateCommentDto })
  @ApiResponse({
    status: 200,
    description: 'update comment',
    type:CommentsEntity
  })
  async update(@Param('commentId') commentId: number, @Body() updateCommentDto: UpdateCommentDto):Promise<CommentsEntity> {
    return await this.commentsService.update(commentId, updateCommentDto.message);
  }

  @Delete('/:commentId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary:'Delete comment'})
  @ApiResponse({
    status: 200,
    description: 'delete comment',
    type: [CommentsEntity]
  })
  async remove(@Param('commentId') commentId: number,@Req() req):Promise<CommentsEntity[]> {
    const userId=req.user.userId;
    return await this.commentsService.remove(commentId,userId);
  }
}
