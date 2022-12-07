import {Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn, JoinColumn, ManyToOne} from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";
import { UsersEntity } from './users.entity';

@Entity('sessions')
export class SessionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type:'text',unique: true})
  token: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => UsersEntity, (user) => user.sessions)
  user: UsersEntity;

}
