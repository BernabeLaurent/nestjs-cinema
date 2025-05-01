import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieReview } from '../movie-review.entity';
import { Repository } from 'typeorm';
import { CreateReviewMovieDto } from '../dtos/create-review-movie.dto';
import { User } from '../../users/user.entity';
import { UsersService } from '../../users/users.service';
import { MoviesService } from '../movies.service';
import { Movie } from '../movie.entity';

@Injectable()
export class CreateMovieReviewProvider {
  constructor(
    @InjectRepository(MovieReview)
    private readonly movieReviewRepository: Repository<MovieReview>,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => MoviesService))
    private readonly moviesService: MoviesService,
  ) {}

  public async create(
    createReviewMovieDto: CreateReviewMovieDto,
  ): Promise<MovieReview> {
    // on check l'user
    let user: User | null;
    try {
      user = await this.usersService.findOneById(createReviewMovieDto.userId);
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'pb de base',
      });
    }

    if (!user) {
      throw new BadRequestException('User not found WITH THIS ID');
    }

    // on check le film
    let movie: Movie | null;
    try {
      movie = await this.moviesService.getMovieById(
        createReviewMovieDto.movieId,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'pb de base',
      });
    }

    if (!movie) {
      throw new BadRequestException('User not found WITH THIS ID');
    }

    // On sauvegarde
    try {
      const movieReview = this.movieReviewRepository.create({
        ...createReviewMovieDto,
        userId: user.id,
        movieId: movie.id,
      });
      return await this.movieReviewRepository.save(movieReview);
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'pb de base',
      });
    }
  }
}
