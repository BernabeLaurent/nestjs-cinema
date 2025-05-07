import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleUser } from './enums/roles-users.enum';
import { RegionsIso } from '../common/enums/regions-iso.enum';
import { Exclude, Expose } from 'class-transformer';
import { Notification } from '../notifications/notification.entity';
import { MovieReview } from '../movies/movie-review.entity';
import { Booking } from '../bookings/booking.entity';

@Entity()
@Exclude()
export class User {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ type: 'varchar', length: 64, nullable: false })
  firstName: string;

  @Expose()
  @Column({ type: 'varchar', length: 64, nullable: false })
  lastName: string;

  @Column({
    unique: true,
    type: 'varchar',
    nullable: false,
    length: 255,
  })
  @Exclude()
  email: string;

  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  googleId?: string;

  @Expose()
  @Column({ default: false, type: 'boolean', nullable: false })
  hasDisability: boolean;

  @Expose()
  @Column({
    type: 'enum',
    enum: RoleUser,
    default: RoleUser.CUSTOMER,
    nullable: false,
  })
  roleUser: RoleUser;

  @Expose()
  @Column({ length: 255, type: 'varchar', nullable: true })
  address?: string;

  @Expose()
  @Column({ length: 60, type: 'varchar', nullable: true })
  city?: string;

  @Expose()
  @Column({ type: 'integer', nullable: true })
  zipCode?: number;

  @Expose()
  @Column({
    type: 'enum',
    enum: RegionsIso,
    nullable: true,
  })
  codeCountry?: RegionsIso;

  @Expose()
  @Column({
    length: 32,
    nullable: true,
  })
  phoneNumber?: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  @Exclude()
  password: string;

  @Expose()
  @CreateDateColumn()
  createDate: Date;

  @Expose()
  @UpdateDateColumn()
  updateDate: Date;

  @DeleteDateColumn()
  @Exclude()
  deleteDate: Date;

  @Expose()
  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @Expose()
  @OneToMany(() => MovieReview, (review) => review.user)
  reviews: MovieReview[];

  @Expose()
  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];
}
