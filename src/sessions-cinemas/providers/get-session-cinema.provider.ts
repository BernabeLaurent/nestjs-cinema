import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { SessionCinema } from '../session-cinema.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Price } from '../prices.entity';

@Injectable()
export class GetSessionCinemaProvider {
  constructor(
    @InjectRepository(SessionCinema)
    private readonly sessionRepository: Repository<SessionCinema>,
  ) {}

  public async findAllByMovieId(id: number): Promise<SessionCinema[]> {
    let sessionsCinema: SessionCinema[] | [];

    try {
      sessionsCinema = await this.sessionRepository
        .createQueryBuilder('session')
        .innerJoinAndMapOne(
          'session.price',
          Price,
          'price',
          `"price"."theaterQuality"::text = "session"."quality"::text`,
        )
        .where('session.movieId = :id', { id })
        .getMany();
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
      sessionsCinema = await this.sessionRepository
        .createQueryBuilder('session')
        .innerJoinAndMapOne(
          'session.price',
          Price,
          'price',
          `"price"."theaterQuality"::text = "session"."quality"::text`,
        )
        .where('session.movieTheaterId = :id', { id })
        .getMany();
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
      sessionsCinema = await this.sessionRepository
        .createQueryBuilder('session')
        .innerJoinAndSelect('session.movieTheater', 'movieTheater')
        .innerJoinAndMapOne(
          'session.price',
          Price,
          'price',
          `"price"."theaterQuality"::text = "session"."quality"::text`,
        )
        .where('movieTheater.theaterId = :id', { id })
        .getMany();
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
      sessionCinema = await this.sessionRepository
        .createQueryBuilder('session')
        .innerJoinAndMapOne(
          'session.price',
          Price,
          'price',
          `"price"."theaterQuality"::text = "session"."quality"::text`,
        )
        .where('session.id = :id', { id })
        .getOne();
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

  public async findAll(): Promise<SessionCinema[]> {
    let sessionsCinema: SessionCinema[] | [];

    try {
      sessionsCinema = await this.sessionRepository
        .createQueryBuilder('session')
        .innerJoinAndSelect('session.movie', 'movie')
        .innerJoinAndSelect('session.movieTheater', 'movieTheater')
        .innerJoinAndSelect('movieTheater.theater', 'theater')
        .innerJoinAndMapOne(
          'session.price',
          Price,
          'price',
          `"price"."theaterQuality"::text = "session"."quality"::text`,
        )
        .getMany();
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment',
        { description: 'error connecting database' + error },
      );
    }

    return sessionsCinema;
  }

  public async findByMovieSearch(searchTerm: string): Promise<SessionCinema[]> {
    let sessionsCinema: SessionCinema[] | [];

    try {
      sessionsCinema = await this.sessionRepository
        .createQueryBuilder('session')
        .innerJoinAndSelect('session.movie', 'movie')
        .innerJoinAndSelect('session.movieTheater', 'movieTheater')
        .innerJoinAndSelect('movieTheater.theater', 'theater')
        .innerJoinAndMapOne(
          'session.price',
          Price,
          'price',
          `"price"."theaterQuality"::text = "session"."quality"::text`,
        )
        .where('LOWER(movie.title) LIKE LOWER(:searchTerm)', { 
          searchTerm: `%${searchTerm}%` 
        })
        .orWhere('LOWER(movie.originalTitle) LIKE LOWER(:searchTerm)', { 
          searchTerm: `%${searchTerm}%` 
        })
        .orWhere('LOWER(movie.description) LIKE LOWER(:searchTerm)', { 
          searchTerm: `%${searchTerm}%` 
        })
        .orWhere('LOWER(movie.tagline) LIKE LOWER(:searchTerm)', { 
          searchTerm: `%${searchTerm}%` 
        })
        .getMany();
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment',
        { description: 'error connecting database' + error },
      );
    }

    return sessionsCinema;
  }
}
