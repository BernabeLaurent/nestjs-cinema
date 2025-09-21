import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionCinema } from '../session-cinema.entity';
import { Repository } from 'typeorm';
import { CreateSessionCinemaDto } from '../dtos/create-session-cinema.dto';
import { MoviesTheatersService } from '../../movies-theaters/movies-theaters.service';
import { MoviesService } from '../../movies/movies.service';
import { MovieTheater } from '../../movies-theaters/movie-theater.entity';
import { Languages } from '../../common/enums/languages.enum';

@Injectable()
export class CreateSessionCinemaProvider {
  constructor(
    @InjectRepository(SessionCinema)
    private readonly sessionCinemaRepository: Repository<SessionCinema>,
    @InjectRepository(MovieTheater)
    private readonly movieTheaterRepository: Repository<MovieTheater>,
    private readonly moviesTheatersService: MoviesTheatersService,
    private readonly moviesService: MoviesService,
  ) {}

  public async create(createSessionCinemaDto: CreateSessionCinemaDto) {
    let movieTheaterId = createSessionCinemaDto.movieTheaterId;

    // Si movieTheaterId n'est pas fourni, utiliser roomId directement
    if (!movieTheaterId && createSessionCinemaDto.roomId) {
      movieTheaterId = createSessionCinemaDto.roomId;
    }

    if (!movieTheaterId) {
      throw new BadRequestException(
        'Either movieTheaterId or roomId must be provided',
      );
    }

    const movieTheater =
      await this.moviesTheatersService.getMovieTheaterById(movieTheaterId);
    if (!movieTheater) {
      throw new BadRequestException('Movie Theater not found WITH THIS ID');
    }

    // Contrôle du film
    const movie = await this.moviesService.getMovieById(
      createSessionCinemaDto.movieId,
    );

    if (!movie) {
      throw new BadRequestException('Movie not found WITH THIS ID');
    }

    // Transformation des dates
    let startTime: Date;
    let endTime: Date;

    if (
      createSessionCinemaDto.date &&
      createSessionCinemaDto.startTime.includes(':')
    ) {
      // Format: date + heure (e.g., "2025-09-11" + "20:00")
      startTime = new Date(
        `${createSessionCinemaDto.date}T${createSessionCinemaDto.startTime}:00.000Z`,
      );
    } else {
      // Format: date complète
      startTime = new Date(createSessionCinemaDto.startTime);
    }

    if (
      createSessionCinemaDto.endTime &&
      createSessionCinemaDto.endTime !== ''
    ) {
      if (
        createSessionCinemaDto.date &&
        createSessionCinemaDto.endTime.includes(':')
      ) {
        endTime = new Date(
          `${createSessionCinemaDto.date}T${createSessionCinemaDto.endTime}:00.000Z`,
        );
      } else {
        endTime = new Date(createSessionCinemaDto.endTime);
      }
    } else {
      // Calculer endTime automatiquement (+2h)
      endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 2);
    }

    const codeLanguage =
      createSessionCinemaDto.codeLanguage || Languages.FRENCH;

    // On insére la session de cinéma
    try {
      const sessionCinema = this.sessionCinemaRepository.create({
        startTime: startTime,
        endTime: endTime,
        quality: createSessionCinemaDto.quality,
        codeLanguage: codeLanguage,
        movie: movie,
        movieTheater: movieTheater,
      });

      return await this.sessionCinemaRepository.save(sessionCinema);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment',
        { description: 'error connecting database' + error },
      );
    }
  }
}
