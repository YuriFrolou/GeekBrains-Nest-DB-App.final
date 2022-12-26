import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsModule } from './news/news.module';
import { CalculatorModule } from './calculator/calculator.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path' ;
import { MailModule } from './mail/mail.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CommentsEntity } from './entities/comments.entity';
import { NewsEntity } from './entities/news.entity';
import { UsersEntity } from './entities/users.entity';
import { CategoriesEntity } from './entities/category.entity';
import { CommentsModule } from './news/comments/comments.module';
import { CategoriesModule } from './news/categories/categories.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/role/roles.guard';
import { SessionEntity } from './entities/session.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';

// @ts-ignore
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.TYPEORM_HOST,
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      port: +process.env.TYPEORM_PORT,
      logging: true,
      migrationsRun: true,
      synchronize: true,
      entities: [UsersEntity,NewsEntity,CommentsEntity,CategoriesEntity,SessionEntity],
    }),
    UsersModule,MailModule,NewsModule,CategoriesModule,CommentsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    AuthModule,EventEmitterModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService,{
    provide: APP_GUARD, useClass: RolesGuard,
  },
  ],
})
export class AppModule {
}
