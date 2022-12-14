import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { NewsEntity } from './news.entity';
import { CommentsEntity } from './comments.entity';
import { IsEnum } from 'class-validator';
import { Role } from '../auth/role/role.enum';
import { SessionEntity } from './session.entity';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  firstName: string;

  @Column('text')
  lastName: string;

  @Column('text')
  email: string;

  @Column('text')
  password:string

  @Column('text', { nullable: true })
  cover: string;

  @Column('text')
  @IsEnum(Role)
  roles: Role;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => NewsEntity, (news) => news.user)
  news: NewsEntity[];

  @OneToMany(() => CommentsEntity, (comments) => comments.user)
  comments: CommentsEntity[];

  @OneToMany(() => SessionEntity, (sessions) => sessions.user)
  sessions: SessionEntity[];
}