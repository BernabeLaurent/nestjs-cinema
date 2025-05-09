import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { Movie } from './movie.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';

@Entity()
@Exclude()
export class Cast {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({
    type: 'varchar',
    length: 250,
    nullable: true,
  })
  character?: string;

  @Exclude()
  @Column({
    type: 'int',
    nullable: false,
  })
  castId: number;

  @Expose()
  @Column({
    type: 'varchar',
    length: 250,
    nullable: false,
  })
  name: string;

  @Expose()
  @Column({
    type: 'varchar',
    length: 250,
    nullable: false,
  })
  originalName: string;

  @Expose()
  @Column({
    type: 'text',
    nullable: true,
  })
  profilePath?: string;

  @Expose()
  @IsNumber()
  @Column({
    type: 'smallint',
    nullable: false,
  })
  order: number;

  @Expose()
  @IsBoolean()
  adult: boolean;

  @Expose()
  @IsNumber()
  gender: number;

  @ApiProperty()
  @Column()
  movieId: number;

  @ManyToOne(() => Movie, (movie) => movie.cast, { onDelete: 'CASCADE' })
  movie: Movie;
}
