import { TmdbProvider } from './tmdb.provider';
import { MoviesService } from '../../movies.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CastDto } from '../dtos/cast.dto';
import { Cast } from '../../cast.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CreateCastProvider {
  constructor(
    @Inject(forwardRef(() => MoviesService))
    private readonly moviesService: MoviesService,
    @Inject(forwardRef(() => TmdbProvider))
    private readonly tmdbProvider: TmdbProvider,
    @InjectRepository(Cast)
    private readonly castsRepository: Repository<Cast>,
  ) {}

  public async upsertCast(cast: CastDto): Promise<Cast> {
    const castFound = await this.castsRepository.findOneBy({
      castId: cast.cast_id,
    });

    if (!castFound) {
      // Sinon on le crée
      return await this.moviesService.createCast(
        this.tmdbProvider.mapTmdbCastDtoToCast(cast),
      );
    }

    return castFound;
  }
}
