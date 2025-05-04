import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Booking } from './booking.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

@Entity()
export class BookingDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'smallint',
    nullable: false,
  })
  seatNumber: number;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  isValidated: boolean;

  @Transform(() => undefined) // Pour éviter la boucle infinie et ne pas renvoyer le booking alors que booking detail est déjà dans booking
  @ApiProperty({ type: () => Booking })
  @ManyToOne(() => Booking, (booking) => booking.reservedSeats)
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;
}
