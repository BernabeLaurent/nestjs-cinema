import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionCinema } from '../session-cinema.entity';
import { MoviesTheatersService } from '../../movies-theaters/movies-theaters.service';
import { PatchSessionCinemaDto } from '../dtos/patch-session-cinema.dto';
import { MovieTheater } from '../../movies-theaters/movie-theater.entity';
import { MoviesService } from '../../movies/movies.service';
import { Movie } from '../../movies/movie.entity';

@Injectable()
export class PatchSessionCinemaProvider {
  constructor(
    @InjectRepository(SessionCinema)
    private readonly sessionCinemaRepository: Repository<SessionCinema>,
    private readonly moviesTheatersService: MoviesTheatersService,
    private readonly moviesService: MoviesService,
  ) {}

  public async update(
    id: number,
    patchSessionCinemaDto: PatchSessionCinemaDto,
  ): Promise<SessionCinema | null> {
    let sessionCinema: SessionCinema | null;

    try {
      sessionCinema = await this.sessionCinemaRepository.findOneBy({
        id: id,
      });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      throw new RequestTimeoutException('unable to process your request', {
        description: 'error connecting database' + error,
      });
    }

    if (!sessionCinema) {
      throw new BadRequestException('Session cinema not found WITH THIS ID');
    }

    // Update the properties of the movie theater
    sessionCinema.startTime =
      patchSessionCinemaDto.startTime ?? sessionCinema.startTime;
    sessionCinema.endTime =
      patchSessionCinemaDto.endTime ?? sessionCinema.endTime;
    sessionCinema.codeLanguage =
      patchSessionCinemaDto.codeLanguage ?? sessionCinema.codeLanguage;
    sessionCinema.quality =
      patchSessionCinemaDto.quality ?? sessionCinema.quality;

    let movieTheater: MovieTheater | null = null;

    // On vérifie que la salle de cinéma existe
    if (patchSessionCinemaDto.movieTheaterId) {
      try {
        movieTheater = await this.moviesTheatersService.getMovieTheaterById(
          patchSessionCinemaDto.movieTheaterId,
        );
        if (!movieTheater) {
          throw new BadRequestException('Movie Theater not found WITH THIS ID');
        }
      } catch (error) {
        throw new RequestTimeoutException(error, {
          description: 'pb de base',
        });
      }
    }

    // Si le champ est présent on le prend, sinon on reprend celui existant
    sessionCinema.movieTheater = movieTheater ?? sessionCinema.movieTheater;

    // On fait la même chose avec le movie_id
    let movie: Movie | null = null;

    // On vérifie que le film existe
    if (patchSessionCinemaDto.movieId) {
      try {
        movie = await this.moviesService.getMovieById(
          patchSessionCinemaDto.movieId,
        );
        if (!movie) {
          throw new BadRequestException('Movie Theater not found WITH THIS ID');
        }
      } catch (error) {
        throw new RequestTimeoutException(error, {
          description: 'pb de base',
        });
      }
    }

    // Si le champ est présent on le prend, sinon on reprend celui existant
    sessionCinema.movie = movie ?? sessionCinema.movie;

    // save the post and return it
    try {
      await this.sessionCinemaRepository.update(
        sessionCinema.id,
        sessionCinema,
      );
    } catch (error) {
      throw new RequestTimeoutException('unable to process your request', {
        description: 'error connecting database' + error,
      });
    }
    return sessionCinema;
  }
}
