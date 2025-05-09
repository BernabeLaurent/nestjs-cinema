import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Languages } from '../common/enums/languages.enum';
import { SessionCinema } from '../sessions-cinemas/session-cinema.entity';
import { MovieReview } from './movie-review.entity';
import { Exclude, Expose } from 'class-transformer';
import { Cast } from './cast.entity';

@Entity()
@Exclude()
export class Movie {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({
    type: 'varchar',
    length: 250,
    nullable: false,
  })
  title: string;

  @Expose()
  @Column({
    type: 'varchar',
    length: 250,
    nullable: false,
  })
  originalTitle: string;

  @Expose()
  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Expose()
  @Column({
    type: 'text',
    nullable: true,
  })
  originalDescription?: string;

  @Expose()
  @Column({
    type: 'text',
    nullable: true,
  })
  tagline?: string;

  @Expose()
  @Column({
    type: 'text',
    nullable: true,
  })
  originalTagline?: string;

  @Expose()
  @Column({
    type: 'smallint',
    nullable: true,
  })
  minimumAge?: number;

  @Expose()
  @Column({
    type: 'smallint',
    nullable: true,
  })
  runtime?: number;

  @Expose()
  @Column({
    type: 'numeric',
    nullable: true,
  })
  averageRating?: number;

  @Expose()
  @Column({
    type: 'boolean',
    nullable: true,
    default: false,
  })
  isFavorite?: boolean;

  @Expose()
  @Column({
    type: 'integer',
    nullable: false,
  })
  movieExterneId: number;

  @Expose()
  @Column({
    type: 'numeric',
    nullable: true,
  })
  averageRatingExterne?: number;

  @Expose()
  @Column({
    type: 'timestamp',
    nullable: false,
  })
  releaseDate: Date;

  @Expose()
  @Column({
    type: 'boolean',
    nullable: true,
    default: false,
  })
  isAdult?: boolean;

  @Expose()
  @Column({
    type: 'timestamp',
    nullable: false,
  })
  startDate: Date;

  @Expose()
  @Column({
    type: 'timestamp',
    nullable: false,
  })
  endDate: Date;

  @Expose()
  @Column({
    type: 'enum',
    enum: Languages,
    nullable: false,
  })
  originalLanguage: Languages;

  @Expose()
  @OneToMany(() => SessionCinema, (sessionCinema) => sessionCinema.movie)
  sessionsCinemas: SessionCinema[];

  @Expose()
  @OneToMany(() => MovieReview, (review) => review.movie)
  reviews: MovieReview[];

  @Expose()
  @Column({
    type: 'text',
    nullable: true,
  })
  backdropPath: string;

  @Expose()
  @Column({
    type: 'text',
    nullable: true,
  })
  posterPath: string;

  @Expose()
  @OneToMany(() => Cast, (cast) => cast.movie, { cascade: true })
  cast: Cast[];
}
