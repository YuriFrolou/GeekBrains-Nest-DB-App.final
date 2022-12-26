import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { NewsEntity } from './news.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('categories')
export class CategoriesEntity {
  @ApiProperty({
    example:1,
    description:'Идентификатор категории'
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example:"Cats",
    description:'Название категории'
  })
  @Column('text')
  name: string;

  @ApiProperty({
    description:'Дата создания категории'
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({
    description:'Дата обновления категории'
  })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // @ApiProperty({description:'Связь с таблицей новостей один-ко-многим'})
  @OneToMany(() => NewsEntity, (news) => news.category)
  news?: NewsEntity[];
}

