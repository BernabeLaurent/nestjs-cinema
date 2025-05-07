import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Theater } from '../theaters/theater.entity';
import { SessionCinema } from '../sessions-cinemas/session-cinema.entity';
import { Exclude, Expose } from 'class-transformer';

@Entity()
@Exclude()
export class MovieTheater {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @ManyToOne(() => Theater, (theater) => theater.moviesTheaters, {
    onDelete: 'CASCADE',
  })
  theater: Theater;

  @Expose()
  @Column()
  theaterId: number;

  @Expose()
  @Column({
    type: 'smallint',
    nullable: false,
  })
  numberSeats: number;

  @Expose()
  @Column({
    type: 'smallint',
    nullable: true,
    default: 0,
  })
  numberSeatsDisabled?: number;

  @Expose()
  @Column({
    type: 'smallint',
    nullable: false,
  })
  roomNumber: number;

  @Expose()
  @OneToMany(() => SessionCinema, (sessionCinema) => sessionCinema.movieTheater)
  sessionsCinema: SessionCinema[];
}
