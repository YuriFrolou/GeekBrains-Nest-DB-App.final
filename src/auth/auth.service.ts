import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare } from '../utils/crypto';
import { UsersEntity } from '../entities/users.entity';
import { NewsService } from '../news/news.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionEntity } from '../entities/session.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionsRepository: Repository<SessionEntity>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
  }

  async validateUser(email: string, pass: string): Promise<any | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await compare(pass, user.password))) {
      const{password,...result}=user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {username:user.username,sub:user.id};
    const accessToken=this.jwtService.sign(payload);
    const session = new SessionEntity();
    session.token = `Bearer ${accessToken}`;
    session.user = user;
    await this.sessionsRepository.save(session);
    return{ accessToken };
  }

  async verify(token: string) {
    return this.jwtService.verify(token);
  }

}
