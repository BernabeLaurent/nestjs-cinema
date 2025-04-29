import { Injectable } from '@nestjs/common';
import { MovieTheater } from './movie-theater.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindMoviesTheatersByTheaterIdProvider } from './providers/find-movies-theaters-by-theater-id.provider';
import { CreateMovieTheaterDto } from './dtos/create-movie-theater.dto';
import { CreateMovieTheaterProvider } from './providers/create-movie-theater.provider';
import { PatchMovieTheaterDto } from './dtos/patch-movie-theater.dto';
import { PatchMovieTheaterProvider } from './providers/patch-movie-theater.provider';

@Injectable()
export class MoviesTheatersService {
  constructor(
    @InjectRepository(MovieTheater)
    private readonly moviesTheatersRepository: Repository<MovieTheater>,
    private readonly findMoviesTheatersByTheaterIdProvider: FindMoviesTheatersByTheaterIdProvider,
    private readonly createMovieTheaterProvider: CreateMovieTheaterProvider,
    private readonly patchMovieTheaterProvider: PatchMovieTheaterProvider,
  ) {}

  public async getMovieTheaterById(id: number): Promise<MovieTheater | null> {
    try {
      return await this.moviesTheatersRepository.findOneBy({ id: id });
    } catch (error) {
      throw new Error('Could not find movietheater with this id', {
        cause: error,
      });
    }
  }

  public async getMoviesTheatersByTheaterId(
    theaterId: number,
  ): Promise<MovieTheater[] | null> {
    return await this.findMoviesTheatersByTheaterIdProvider.findAll(theaterId);
  }

  public async createMovieTheater(
    createMovieTheaterDto: CreateMovieTheaterDto,
  ): Promise<MovieTheater | null> {
    return await this.createMovieTheaterProvider.create(createMovieTheaterDto);
  }

  public async updateMovieTheater(
    patchMovieTheaterDto: PatchMovieTheaterDto,
  ): Promise<MovieTheater | null> {
    return await this.patchMovieTheaterProvider.update(patchMovieTheaterDto);
  }
}
