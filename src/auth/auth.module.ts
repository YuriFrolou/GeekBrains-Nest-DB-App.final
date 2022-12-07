import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { SessionEntity } from '../entities/session.entity';
import { Repository } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '../entities/users.entity';

@Module({
  imports: [forwardRef(() => UsersModule), PassportModule,TypeOrmModule.forFeature([SessionEntity]),
    JwtModule.register({
      secret: jwtConstants.secret, signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, LocalStrategy,JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService,JwtStrategy],
})
export class AuthModule {
}
