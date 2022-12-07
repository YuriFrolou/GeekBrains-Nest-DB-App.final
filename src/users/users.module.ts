import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsEntity } from '../entities/news.entity';
import { CommentsEntity } from '../entities/comments.entity';
import { UsersEntity } from '../entities/users.entity';
import { AuthModule } from '../auth/auth.module';
import { SessionEntity } from '../entities/session.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LocalStrategy } from '../auth/local.strategy';
import { JwtStrategy } from '../auth/jwt.strategy';
import { jwtConstants } from '../auth/constants';

@Module({
  imports:[TypeOrmModule.forFeature([UsersEntity,SessionEntity]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports:[UsersService]
})
export class UsersModule {}
