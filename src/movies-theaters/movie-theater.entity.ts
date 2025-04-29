import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Theater } from '../theaters/theater.entity';

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
}
