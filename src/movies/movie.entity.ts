import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Languages } from '../common/enums/languages.enum';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 250,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'varchar',
    length: 250,
    nullable: false,
  })
  originalTitle: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  originalDescription?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  tagline?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  originalTagline?: string;

  @Column({
    type: 'smallint',
    nullable: true,
  })
  minimumAge?: number;

  @Column({
    type: 'smallint',
    nullable: true,
  })
  runtime?: number;

  @Column({
    type: 'numeric',
    nullable: true,
  })
  averageRating?: number;

  @Column({
    type: 'boolean',
    nullable: true,
    default: false,
  })
  isFavorite?: boolean;

  @Column({
    type: 'integer',
    nullable: false,
  })
  movieExterneId: number;

  @Column({
    type: 'numeric',
    nullable: true,
  })
  averageRatingExterne?: number;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  releaseDate: Date;

  @Column({
    type: 'boolean',
    nullable: true,
    default: false,
  })
  isAdult?: boolean;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  startDate: Date;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: Languages,
    nullable: false,
  })
  originalLanguage: Languages;
}
