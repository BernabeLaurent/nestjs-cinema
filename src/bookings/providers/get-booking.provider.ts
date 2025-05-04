import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from '../booking.entity';
import { Repository } from 'typeorm';
import { MovieTheater } from '../../movies-theaters/movie-theater.entity';
import { MoviesTheatersService } from '../../movies-theaters/movies-theaters.service';
import { User } from '../../users/user.entity';
import { UsersService } from '../../users/users.service';
import { SessionCinema } from '../../sessions-cinemas/session-cinema.entity';
import { SessionsCinemasService } from '../../sessions-cinemas/sessions-cinemas.service';

@Injectable()
export class GetBookingProvider {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly moviesTheatersService: MoviesTheatersService,
    private readonly usersService: UsersService,
    private readonly sessionsCinemasService: SessionsCinemasService,
  ) {}

  public async getById(id: number): Promise<Booking | null> {
    try {
      return await this.bookingRepository.findOne({
        where: { id },
      });
    } catch (error) {
      throw new Error('Could not find movietheater with this id', {
        cause: error,
      });
    }
  }

  public async getByUser(userId: number): Promise<Booking[] | null> {
    // On vérifie que l'utilisateur existe
    let user: User | null;
    try {
      user = await this.usersService.findOneById(userId);
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'pb de base',
      });
    }

    if (!user) {
      throw new BadRequestException('User not found WITH THIS ID');
    }

    try {
      return await this.bookingRepository.find({
        where: { userId },
      });
    } catch (error) {
      throw new Error('Could not find movietheater with this id', {
        cause: error,
      });
    }
  }

  public async getByMovieTheather(
    movieTheaterId: number,
  ): Promise<Booking[] | null> {
    let movieTheater: MovieTheater | null;

    try {
      movieTheater =
        await this.moviesTheatersService.getMovieTheaterById(movieTheaterId);
      if (!movieTheater) {
        throw new BadRequestException('Movie Theater not found WITH THIS ID');
      }
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'pb de base',
      });
    }

    try {
      return await this.bookingRepository.find({
        where: { sessionCinema: { movieTheaterId: movieTheaterId } },
        relations: ['sessionCinema'],
      });
    } catch (error) {
      throw new Error('Could not find movietheater with this id', {
        cause: error,
      });
    }
  }

  public async getBySessionCinema(
    sessionCinemaId: number,
  ): Promise<Booking[] | null> {
    // On vérifie que la session cinéma existe
    let sessionCinema: SessionCinema | null;

    try {
      sessionCinema =
        await this.sessionsCinemasService.getSessionCinemaById(sessionCinemaId);
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'pb de base',
      });
    }

    if (!sessionCinema) {
      throw new BadRequestException('SessionCinema not found WITH THIS ID');
    }

    try {
      return await this.bookingRepository.find({
        where: { sessionCinema: { id: sessionCinemaId } },
        relations: ['sessionCinema'],
      });
    } catch (error) {
      throw new Error('Could not find movietheater with this id', {
        cause: error,
      });
    }
  }

  public async getBookingsDetailsByBooking(
    bookingId: number,
  ): Promise<Booking[] | null> {
    // On vérifie que la réservation existe
    const booking = await this.getById(bookingId);

    if (!booking) {
      throw new BadRequestException('Booking not found WITH THIS ID');
    }

    try {
      return await this.bookingRepository.find({
        where: { id: bookingId },
        relations: ['reservedSeats'],
      });
    } catch (error) {
      throw new Error('Could not find movietheater with this id', {
        cause: error,
      });
    }
  }

  public async getAll(): Promise<Booking[]> {
    try {
      return await this.bookingRepository.find();
    } catch (error) {
      throw new Error('Could not find movietheater with this id', {
        cause: error,
      });
    }
  }
}
