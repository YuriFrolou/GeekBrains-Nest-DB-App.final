import { ExecutionContext, forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionEntity } from '../entities/session.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { NewsService } from '../news/news.service';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
}
