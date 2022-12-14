import { forwardRef, Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsEntity } from '../../entities/news.entity';
import { CommentsEntity } from '../../entities/comments.entity';
import { UsersEntity } from '../../entities/users.entity';
import { NewsModule } from '../news.module';
import { NewsService } from '../news.service';
import { UsersModule } from '../../users/users.module';
import { UsersService } from '../../users/users.service';
import { SocketCommentsGateway } from './socket-comments.gateway';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [forwardRef(() => NewsModule),UsersModule,AuthModule,
    TypeOrmModule.forFeature([CommentsEntity])
  ],
  controllers: [CommentsController],
  providers: [CommentsService,SocketCommentsGateway],
  exports:[CommentsService]
})
export class CommentsModule {}
