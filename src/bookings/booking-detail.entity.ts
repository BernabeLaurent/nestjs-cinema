import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Booking } from './booking.entity';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ type: () => Booking })
  @ManyToOne(() => Booking, (booking) => booking.reservedSeats)
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;
}
