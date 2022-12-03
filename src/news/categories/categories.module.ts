import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsEntity } from '../entities/news.entity';
import { CategoriesEntity } from './entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoriesEntity])
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports:[CategoriesService]
})
export class CategoriesModule {}