import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Exclude, Expose } from 'class-transformer';

@Entity()
@Exclude()
export class Notification {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @ApiProperty({
    description: "ID de l'utilisateur lié à la notification",
    example: 42,
  })
  @Column()
  userId: number;

  @Expose()
  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Expose()
  @CreateDateColumn()
  createDate: Date;

  @Expose()
  @UpdateDateColumn()
  updateDate: Date;

  @DeleteDateColumn()
  @Exclude()
  deleteDate: Date;
}
