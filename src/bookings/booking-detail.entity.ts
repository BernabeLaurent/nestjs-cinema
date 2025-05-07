import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Booking } from './booking.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

@Entity()
@Exclude()
export class BookingDetail {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({
    type: 'smallint',
    nullable: false,
  })
  seatNumber: number;

  @Expose()
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

  @Expose()
  @CreateDateColumn()
  createDate: Date;

  @Expose()
  @UpdateDateColumn()
  updateDate: Date;
}
