import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieReview } from '../movie-review.entity';
import { Repository } from 'typeorm';
import { ValidateReviewMovieDto } from '../dtos/validate-review-movie.dto';

@Injectable()
export class ValidateMovieReviewProvider {
  constructor(
    @InjectRepository(MovieReview)
    private readonly movieReviewRepository: Repository<MovieReview>,
  ) {}

  public async validate(
    reviewId: number,
    validateReviewMovieDto: ValidateReviewMovieDto,
  ): Promise<MovieReview> {
    let review: MovieReview | null;

    try {
      review = await this.movieReviewRepository.findOneBy({
        id: reviewId,
      });
    } catch (error) {
      throw new RequestTimeoutException('unable to process your request', {
        description: 'error connecting database' + error,
      });
    }

    if (!review) {
      throw new BadRequestException('Movie Review not found WITH THIS ID');
    }

    // Update the validation status
    review.isValidated = validateReviewMovieDto.isValidated;

    // save and return
    try {
      await this.movieReviewRepository.update(review.id, review);
    } catch (error) {
      throw new RequestTimeoutException('unable to process your request', {
        description: 'error connecting database' + error,
      });
    }
    return review;
  }
}
