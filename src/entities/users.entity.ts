import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { NewsEntity } from './news.entity';
import { CommentsEntity } from './comments.entity';
import { IsEnum } from 'class-validator';
import { Role } from '../auth/role/role.enum';
import { SessionEntity } from './session.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class UsersEntity {
  @ApiProperty({
    example:1,
    description:'Идентификатор пользователя'
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example:"Иван",
    description:'Имя пользователя'
  })
  @Column('text')
  firstName: string;

  @ApiProperty({
    example:"Сидоров",
    description:'Фамилия пользователя'
  })
  @Column('text')
  lastName: string;

  @ApiProperty({
    example:"example@mail.ru",
    description:'Email пользователя'
  })
  @Column('text')
  email: string;

  @ApiProperty({
    example:"22222",
    description:'Пароль пользователя'
  })
  @Column('text')
  password:string


  @ApiProperty({
    example:"https://termosfera.su/wp-content/uploads/2022/04/2816616767_vubrbej.jpg",
    description:'Аватар пользователя'
  })
  @Column('text', { nullable: true })
  cover: string;

  @ApiProperty({
    example:"user",
    description:'Роль пользователя'
  })
  @Column('text')
  @IsEnum(Role)
  roles: Role;

  @ApiProperty({
    description:'Дата создания пользователя'
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({
    description:'Дата обновления пользователя'
  })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // @ApiProperty({description:'Связь с таблицей новостей один-ко-многим'})
  @OneToMany(() => NewsEntity, (news) => news.user)
  news?: NewsEntity[];

  // @ApiProperty({description:'Связь с таблицей комментариев один-ко-многим'})
  @OneToMany(() => CommentsEntity, (comments) => comments.user)
  comments?: CommentsEntity[];

  // @ApiProperty({description:'Связь с таблицей сессий один-ко-многим'})
  @OneToMany(() => SessionEntity, (sessions) => sessions.user)
  sessions?: SessionEntity[];
}