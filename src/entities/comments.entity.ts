import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UsersEntity } from './users.entity';
import { NewsEntity } from './news.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('comments')
export class CommentsEntity {
  @ApiProperty({
    example:1,
    description:'Идентификатор комментария'
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example:"Комментарий",
    description:'Это текст комментария'
  })
  @Column('text')
  message: string;


  @ApiProperty({
    description:'Дата создания комментария'
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({
    description:'Дата обновления комментария'
  })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // @ApiProperty({description:'Связь с таблицей пользователей многие-к-одному'})
  @ManyToOne(() => UsersEntity, (user) => user.comments)
  user?: UsersEntity;

  // @ApiProperty({description:'Связь с таблицей новостей многие-к-одному'})
  @ManyToOne(() => NewsEntity, (news) => news.comments)
  news?: NewsEntity;

}

