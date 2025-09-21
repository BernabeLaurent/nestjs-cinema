import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieTheater } from '../movie-theater.entity';
import { Repository } from 'typeorm';
import { PatchMovieTheaterDto } from '../dtos/patch-movie-theater.dto';
import { Theater } from '../../theaters/theater.entity';
import { TheatersService } from '../../theaters/theaters.service';

@Injectable()
export class PatchMovieTheaterProvider {
  constructor(
    @InjectRepository(MovieTheater)
    private readonly moviesTheatersRepository: Repository<MovieTheater>,
    private readonly theatersService: TheatersService,
  ) {}

  public async update(
    id: number,
    patchMovieTheaterDto: PatchMovieTheaterDto,
  ): Promise<MovieTheater | null> {
    let movieTheater: MovieTheater | null;

    try {
      movieTheater = await this.moviesTheatersRepository.findOneBy({
        id: id,
      });
    } catch (error) {
      throw new RequestTimeoutException('unable to process your request', {
        description: 'error connecting database' + error,
      });
    }

    if (!movieTheater) {
      throw new BadRequestException('Movie Theater not found WITH THIS ID');
    }

    // Update the properties of the movie theater
    movieTheater.numberSeats =
      patchMovieTheaterDto.numberSeats ?? movieTheater.numberSeats;
    movieTheater.numberSeatsDisabled =
      patchMovieTheaterDto.numberSeatsDisabled ??
      movieTheater.numberSeatsDisabled;
    movieTheater.roomNumber =
      patchMovieTheaterDto.roomNumber ?? movieTheater.roomNumber;

    let theater: Theater | null = null;

    // On vérifie que le cinéma existe
    if (patchMovieTheaterDto.theaterId) {
      try {
        theater = await this.theatersService.findOneById(
          patchMovieTheaterDto.theaterId,
        );
        if (!theater) {
          throw new BadRequestException('Theater not found WITH THIS ID');
        }
      } catch (error) {
        throw new RequestTimeoutException(error, {
          description: 'pb de base',
        });
      }
    }

    // Si le champ est présent on le prend, sinon on reprend celui existant
    movieTheater.theater = theater ?? movieTheater.theater;

    // save the post and return it
    try {
      await this.moviesTheatersRepository.update(movieTheater.id, movieTheater);
    } catch (error) {
      throw new RequestTimeoutException('unable to process your request', {
        description: 'error connecting database' + error,
      });
    }
    return movieTheater;
  }
}
