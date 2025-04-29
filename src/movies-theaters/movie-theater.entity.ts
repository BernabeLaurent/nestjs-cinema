import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Theater } from '../theaters/theater.entity';
import { SessionCinema } from '../sessions-cinemas/session-cinema.entity';

@Entity()
export class MovieTheater {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Theater, (theater) => theater.moviesTheaters, {
    onDelete: 'CASCADE',
  })
  theater: Theater;

  @Column({
    type: 'smallint',
    nullable: false,
  })
  numberSeats: number;

  @Column({
    type: 'smallint',
    nullable: true,
    default: 0,
  })
  numberSeatsDisabled?: number;

  @Column({
    type: 'smallint',
    nullable: false,
  })
  roomNumber: number;

  @OneToMany(() => SessionCinema, (sessionCinema) => sessionCinema.movieTheater)
  sessionsCinema: SessionCinema[];
}
