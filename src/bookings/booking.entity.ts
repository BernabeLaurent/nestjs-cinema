import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BookingDetail } from './booking-detail.entity';
import { User } from 'src/users/user.entity';
import { SessionCinema } from '../sessions-cinemas/session-cinema.entity';
import { BookingStatus } from './enums/booking-status.enum';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @ManyToOne(() => User, (user) => user.bookings, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ example: 5 })
  @Column()
  userId: number;

  @ApiProperty({ example: 3 })
  @Column()
  sessionCinemaId: number;

  @ApiProperty({ type: () => SessionCinema })
  @ManyToOne(() => SessionCinema, (sessionCinema) => sessionCinema.bookings, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sessionCinemaId' })
  sessionCinema: SessionCinema;

  @ApiProperty({ type: () => [BookingDetail] })
  @OneToMany(() => BookingDetail, (bookingDetail) => bookingDetail.booking, {
    cascade: true,
  })
  reservedSeats: BookingDetail[];

  @Column({
    type: 'smallint',
    nullable: false,
  })
  numberSeats: number;

  @Column({
    type: 'smallint',
    nullable: false,
  })
  numberSeatsDisabled: number;

  @Column({
    type: 'numeric',
    nullable: false,
  })
  totalPrice: number;

  @CreateDateColumn()
  createDate: Date;
}
