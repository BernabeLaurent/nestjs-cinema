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
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { Movie } from './movie.entity';
import { User } from '../users/user.entity';
import { Exclude, Expose } from 'class-transformer';

@Entity()
@Exclude()
export class MovieReview {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @ApiProperty({
    description: 'UserId',
    example: 1,
  })
  @Column()
  userId: number;

  @Expose()
  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Expose()
  @ApiProperty({
    description: 'ID du film lié',
    example: 2,
  })
  @Column()
  movieId: number;

  @Expose()
  @ManyToOne(() => Movie, (movie) => movie.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movieId' })
  movie: Movie;

  @Expose()
  @ApiProperty({
    description: 'Note du film entre 0 et 10',
    example: 1,
    type: 'number',
  })
  @Column({
    type: 'smallint',
    nullable: false,
    comment: 'Note entre 0 et 10',
  })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @Max(10)
  note: number;

  @Expose()
  @ApiProperty({
    description: 'True si la note a été validée',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isValidated: boolean;

  @Expose()
  @CreateDateColumn()
  createDate: Date;

  @Expose()
  @UpdateDateColumn()
  updateDate: Date;

  @Exclude()
  @DeleteDateColumn()
  deleteDate: Date;
}
