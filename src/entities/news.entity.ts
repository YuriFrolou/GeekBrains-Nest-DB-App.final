import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersEntity } from './users.entity';
import { CategoriesEntity } from './category.entity';
import { CommentsEntity } from './comments.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('news')
  export class NewsEntity {

  @ApiProperty({
    example:1,
    description:'Идентификатор новости'
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example:'Новая новость',
    description:'Заголовок новости'
  })
  @Column('text')
  title: string;

  @ApiProperty({
    example:"Это описание новости",
    description:'Описание новости'
  })
  @Column('text')
  description: string;

  @ApiProperty({
    example:"https://termosfera.su/wp-content/uploads/2022/04/2816616767_vubrbej.jpg",
    description:'Обложка новости'
  })
  @Column('text', { nullable: true })
  cover: string;

  @ApiProperty({
    description:'Дата создания новости'
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({
    description:'Дата обновления новости'
  })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // @ApiProperty({description:'Связь с таблицей пользователей многие-к-одному'})
  @ManyToOne(() => UsersEntity, (user) => user.news)
  user?: UsersEntity;

  // @ApiProperty({description:'Связь с таблицей категорий многие-к-одному'})
  @ManyToOne(() => CategoriesEntity, (category) => category.news)
  category?: CategoriesEntity;

  // @ApiProperty({description:'Связь с таблицей комментариев один-ко-многим'})
  @OneToMany(() => CommentsEntity, (comments) => comments.news)
  comments?: CommentsEntity[];
}
