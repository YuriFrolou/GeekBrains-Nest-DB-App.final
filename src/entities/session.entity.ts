import {Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn, JoinColumn, ManyToOne} from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";
import { UsersEntity } from './users.entity';

@Entity('sessions')
export class SessionEntity {
  @ApiProperty({
    example:1,
    description:'Идентификатор сессии'
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example:"rtytw534543",
    description:'Токен сессии'
  })
  @Column({type:'text',unique: true})
  token: string;

  @ApiProperty({
    description:'Дата создания сессии'
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  // @ApiProperty({description:'Связь с таблицей пользователей многие-к-одному'})
  @ManyToOne(() => UsersEntity, (user) => user.sessions)
  user: UsersEntity;

}
