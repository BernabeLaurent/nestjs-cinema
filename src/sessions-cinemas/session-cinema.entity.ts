import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { TheaterQuality } from './enums/theaters-qualities.enum';
import { Languages } from '../common/enums/languages.enum';
import { MovieTheater } from '../movies-theaters/movie-theater.entity';
import { Movie } from '../movies/movie.entity';

@Entity()
export class SessionCinema {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Date et heure du début de la séance',
    example: '2025-05-20T20:30:00.000Z',
    type: String,
    format: 'date-time',
  })
  @Column({ type: 'timestamp' })
  startTime: Date;

  @ApiProperty({
    description: 'Date et heure de fin de la séance',
    example: '2025-05-20T20:30:00.000Z',
    type: String,
    format: 'date-time',
  })
  @Column({ type: 'timestamp' })
  endTime: Date;

  @ApiProperty({
    enum: TheaterQuality,
    description: 'Qualité de diffusion du film',
    example: TheaterQuality.UHD_4K,
  })
  @Column({
    type: 'enum',
    enum: TheaterQuality,
  })
  quality: TheaterQuality;

  @ApiProperty({
    enum: Languages,
    description: 'Langue du film',
    example: Languages.FRANCE,
  })
  @Column({
    type: 'enum',
    enum: Languages,
  })
  codeLanguage: Languages;

  @ManyToOne(
    () => MovieTheater,
    (MovieTheater) => MovieTheater.sessionsCinema,
    { eager: true },
  )
  @JoinColumn({ name: 'movieTheaterId' })
  @ApiProperty({ type: () => MovieTheater })
  movieTheater: MovieTheater;

  @ManyToOne(() => Movie, (movie) => movie.sessionsCinemas, {
    eager: true,
  })
  @ApiProperty({ type: () => Movie })
  @JoinColumn({ name: 'movieId' })
  movie: Movie;

}
