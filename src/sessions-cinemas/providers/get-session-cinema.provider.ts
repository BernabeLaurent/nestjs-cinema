import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { SessionCinema } from '../session-cinema.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GetSessionCinemaProvider {
  constructor(
    @InjectRepository(SessionCinema)
    private readonly sessionRepository: Repository<SessionCinema>,
  ) {}

  public async findAllByMovieId(id: number): Promise<SessionCinema[]> {
    let sessionsCinema: SessionCinema[] | [];

    try {
      sessionsCinema = await this.sessionRepository.findBy({ movieId: id });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment',
        { description: 'error connecting database' + error },
      );
    }

    return sessionsCinema;
  }

  public async findAllByMovieTheaterId(id: number): Promise<SessionCinema[]> {
    let sessionsCinema: SessionCinema[] | [];

    try {
      sessionsCinema = await this.sessionRepository.findBy({
        movieTheaterId: id,
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment',
        { description: 'error connecting database' + error },
      );
    }

    return sessionsCinema;
  }

  public async findAllByTheaterId(id: number): Promise<SessionCinema[]> {
    let sessionsCinema: SessionCinema[] | [];

    try {
      sessionsCinema = await this.sessionRepository.find({
        where: {
          movieTheater: {
            theaterId: id,
          },
        },
        relations: ['movieTheater'],
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment',
        { description: 'error connecting database' + error },
      );
    }

    return sessionsCinema;
  }

  public async findById(id: number): Promise<SessionCinema> {
    let sessionCinema: SessionCinema | null;

    try {
      sessionCinema = await this.sessionRepository.findOneBy({ id });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment',
        { description: 'error connecting database' + error },
      );
    }

    if (!sessionCinema) {
      throw new BadRequestException('Session Cinema not found WITH THIS ID');
    }

    return sessionCinema;
  }
}
