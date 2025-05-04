import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from '../booking.entity';
import { Repository } from 'typeorm';
import { CreateBookingDto } from '../dtos/create-booking.dto';
import { User } from '../../users/user.entity';
import { UsersService } from '../../users/users.service';
import { SessionCinema } from '../../sessions-cinemas/session-cinema.entity';
import { SessionsCinemasService } from '../../sessions-cinemas/sessions-cinemas.service';
import { BookingDetail } from '../booking-detail.entity';

@Injectable()
export class CreateBookingProvider {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly usersService: UsersService,
    private readonly sessionsCinemasService: SessionsCinemasService,
  ) {}

  public async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    let user: User | null;
    // ON vérifie l'utilisateur
    try {
      user = await this.usersService.findOneById(createBookingDto.userId);
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'pb de base',
      });
    }

    if (!user) {
      throw new BadRequestException('User not found WITH THIS ID');
    }

    // On verifie la séance de cinéma
    let sessionCinema: SessionCinema | null;
    try {
      sessionCinema = await this.sessionsCinemasService.getSessionCinemaById(
        createBookingDto.sessionCinemaId,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'pb de base',
      });
    }

    if (!sessionCinema) {
      throw new BadRequestException('SessionCinema not found WITH THIS ID');
    }

    // Pour récupérer les détails de la réservation
    const reservedSeats = createBookingDto.reservedSeats;

    const booking = this.bookingRepository.create({
      ...createBookingDto,
      userId: user.id,
      sessionCinemaId: sessionCinema.id,
      reservedSeats: [],
    });

    // Calculer le nombre total de sièges réservés
    const totalSeats =
      createBookingDto.numberSeats + createBookingDto.numberSeatsDisabled;

    if (totalSeats !== reservedSeats.length) {
      throw new BadRequestException(
        'Le nombre de sièges réservés ne correspond pas au nombre total de sièges réservés.',
      );
    }

    // On construit le détail de la réservation
    booking.reservedSeats = reservedSeats.map((detailDto) => {
      const detail = new BookingDetail();
      detail.seatNumber = detailDto.seatNumber;
      detail.isValidated = detailDto.isValidated ?? false;
      detail.booking = booking;
      return detail;
    });

    // On sauvegarde
    try {
      return await this.bookingRepository.save(booking);
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'pb de base',
      });
    }
  }
}
