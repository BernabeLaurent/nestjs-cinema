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
import { Exclude, Expose } from 'class-transformer';

@Entity()
@Exclude()
export class Booking {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Expose()
  @ManyToOne(() => User, (user) => user.bookings, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Expose()
  @ApiProperty({ example: 5 })
  @Column()
  userId: number;

  @Expose()
  @ApiProperty({ example: 3 })
  @Column()
  sessionCinemaId: number;

  @Expose()
  @ApiProperty({ type: () => SessionCinema })
  @ManyToOne(() => SessionCinema, (sessionCinema) => sessionCinema.bookings, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sessionCinemaId' })
  sessionCinema: SessionCinema;

  @Expose()
  @ApiProperty({ type: () => [BookingDetail] })
  @OneToMany(() => BookingDetail, (bookingDetail) => bookingDetail.booking, {
    cascade: true,
  })
  reservedSeats: BookingDetail[];

  @Expose()
  @Column({
    type: 'smallint',
    nullable: false,
  })
  numberSeats: number;

  @Expose()
  @Column({
    type: 'smallint',
    nullable: false,
  })
  numberSeatsDisabled: number;

  @Expose()
  @Column({
    type: 'numeric',
    nullable: false,
  })
  totalPrice: number;

  @Expose()
  @CreateDateColumn()
  createDate: Date;
}
