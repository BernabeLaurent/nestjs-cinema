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

@Injectable()
export class CreateSessionCinemaProvider {
  constructor(
    @InjectRepository(SessionCinema)
    private readonly sessionCinemaRepository: Repository<SessionCinema>,
    private readonly moviesTheatersService: MoviesTheatersService,
    private readonly moviesService: MoviesService,
  ) {}

  public async create(createSessionCinemaDto: CreateSessionCinemaDto) {
    const movieTheater = await this.moviesTheatersService.getMovieTheaterById(
      createSessionCinemaDto.movieTheaterId,
    );

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

    // On insére la session de cinéma
    try {
      const sessionCinema = this.sessionCinemaRepository.create({
        ...createSessionCinemaDto,
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
