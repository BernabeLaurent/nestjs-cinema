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

@Entity()
export class SessionCinema {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Heure de début de la séance (HH:mm:ss)',
    example: '14:30:00',
    type: String,
    format: 'time',
    nullable: false,
  })
  @Column({ type: 'time' })
  startTime: Date;

  @ApiProperty({
    description: 'Heure de fin de la séance (HH:mm:ss)',
    example: '14:30:00',
    type: String,
    format: 'time',
    nullable: false,
  })
  @Column({ type: 'time' })
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
}
