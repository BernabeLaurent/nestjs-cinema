import { Repository } from 'typeorm';
import { Movie } from '../movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestTimeoutException } from '@nestjs/common';

export class FindOneMovieByExternalIdProvider {
  constructor(
    @InjectRepository(Movie)
    private readonly moviesRepository: Repository<Movie>,
  ) {}

  public async findOneByExternalId(id: number): Promise<Movie | null> {
    let movie: Movie | null;

    try {
      movie = await this.moviesRepository.findOneBy({ movieExterneId: id });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'pb de base',
      });
    }

    // Si on ne trouve pas le film, on retourne null
    if (!movie) {
      return null;
    }
    return movie;
  }
}
