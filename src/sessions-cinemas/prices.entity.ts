import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TheaterQuality } from './enums/theaters-qualities.enum';

@Entity()
export class Price {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: TheaterQuality,
    nullable: false,
  })
  theaterQuality: TheaterQuality;

  @Column({
    type: 'float',
    nullable: false,
  })
  price: number;
}
