import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieTheater } from '../movie-theater.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindMoviesTheatersByTheaterIdProvider {
  constructor(
    @InjectRepository(MovieTheater)
    private readonly moviesTheatersRepository: Repository<MovieTheater>,
  ) {}

  public async findAll(theaterId: number): Promise<MovieTheater[] | null> {
    try {
      return await this.moviesTheatersRepository.find({
        where: { theater: { id: theaterId } },
        relations: ['theater'],
      });
    } catch (error) {
      throw new Error('Could not find movietheater with this id', {
        cause: error,
      });
    }
  }
}
