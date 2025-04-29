import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { MovieTheater } from '../movie-theater.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMovieTheaterDto } from '../dtos/create-movie-theater.dto';
import { Theater } from '../../theaters/theater.entity';
import { TheatersService } from '../../theaters/theaters.service';

@Injectable()
export class CreateMovieTheaterProvider {
  constructor(
    @InjectRepository(MovieTheater)
    private readonly moviesTheatersRepository: Repository<MovieTheater>,
    private readonly theaterService: TheatersService,
  ) {}

  public async create(
    createMovieTheaterDto: CreateMovieTheaterDto,
  ): Promise<MovieTheater> {
    let theater: Theater | null;

    // On vérifie que le cinéma existe
    try {
      theater = await this.theaterService.findOneById(
        createMovieTheaterDto.theaterId,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'pb de base',
      });
    }

    if (!theater) {
      throw new ConflictException('Theater not found');
    }

    // On insére la salle de cinéma
    try {
      const movieTheater = this.moviesTheatersRepository.create({
        ...createMovieTheaterDto,
        theater: theater,
      });
      return await this.moviesTheatersRepository.save(movieTheater);
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'pb de base',
      });
    }
  }
}
