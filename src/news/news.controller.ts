import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Render, UseGuards,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from '../dto/create-news.dto';
import { UpdateNewsDto } from '../dto/update-news.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HelperFileLoad } from '../utils/HelperFileLoad';
import { NewsEntity } from '../entities/news.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


const PATH_NEWS = '/static/';
HelperFileLoad.path = PATH_NEWS;


@ApiBearerAuth()
@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({summary:'Create news'})
  @ApiBody({ type: CreateNewsDto })
  @ApiResponse({
    status: 201,
    description: 'create new news',
    type: NewsEntity,
  })
  @UseInterceptors(FileInterceptor('cover', {
    storage: diskStorage({
      destination: HelperFileLoad.destinationPath,
      filename: HelperFileLoad.customFileName,
    }),
  }))
  async create(@Body() createNewsDto: CreateNewsDto, @UploadedFile() cover: Express.Multer.File=null): Promise<NewsEntity> {
    if (cover?.filename) {
      createNewsDto.cover = PATH_NEWS + cover.filename;
    }
    return await this.newsService.createNews(createNewsDto);
  }


  @Get('all')
  @ApiOperation({summary:'Render all news'})
  @ApiResponse({
    status: 200,
    description: 'render all news',
  })
  @Render('news-list')
  async renderAllNews(): Promise<Object> {
    const news = await this.newsService.findAll();
    return {
      news: news,
      seo: {
        title: 'Список новостей',
        description: 'Самые крутые новости',
      },
    };
  }


  @Get('all/:userId')
  @ApiOperation({summary:'Render all news by user'})
  @ApiResponse({
    status: 200,
    description: 'render all news by user',
  })
  @Render('news-list')
  async findAllByUser(@Param('userId') userId: number): Promise<Object> {
    const news = await this.newsService.findAllByUser(userId);
    return {
      news: news,
      seo: {
        title: 'Список новостей',
        description: 'Самые крутые новости',
      },
    };
  }


  @Get('/detail/:id')
  @ApiOperation({summary:'Render news by id'})
  @ApiResponse({
    status: 200,
    description: 'render news by id',
  })
  @Render('news-detail')
  async renderOneNews(@Param('id') id: number): Promise<Object> {
    const news = await this.newsService.findOneById(id);
    return {
      news: {
        ...news,
      },
      seo: {
        title: 'Детальная страница новости',
        description: 'Самая крутая новость',
      },
    };
  }

  @Get()
  @ApiOperation({summary:'Get all news'})
  @ApiResponse({
    status: 200,
    description: 'get all news',
    type: [NewsEntity],
  })
  async findAll(): Promise<NewsEntity[]> {
    return await this.newsService.findAll();
  }

  @Get(':id')
  @ApiOperation({summary:'Get news by id'})
  @ApiResponse({
    status: 200,
    description: 'get news by id',
    type: NewsEntity,
  })
  async findOne(@Param('id') id: number): Promise<NewsEntity> {
    return await this.newsService.findOneById(id);
  }

  @Patch(':id')
  @ApiOperation({summary:'Update news'})
  @ApiBody({ type: UpdateNewsDto })
  @ApiResponse({
    status: 200,
    description: 'update news',
    type: NewsEntity,
  })
  async update(@Param('id') id: number, @Body() updateNewsDto: UpdateNewsDto): Promise<NewsEntity> {
    return this.newsService.update(id, updateNewsDto);
  }

  @Delete(':id')
  @ApiOperation({summary:'Delete news'})
  @ApiResponse({
    status: 200,
    description: 'delete news by id',
    type: [NewsEntity],
  })
  async remove(@Param('id') id: number): Promise<NewsEntity[]> {
    return await this.newsService.remove(id);
  }
}
