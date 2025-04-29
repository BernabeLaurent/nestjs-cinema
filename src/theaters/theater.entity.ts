import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RegionsIso } from '../common/enums/regions-iso.enum';
import { MovieTheater } from '../movies-theaters/movie-theater.entity';

@Entity()
export class Theater {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 250,
    nullable: false,
  })
  name: string;

  @Column({ type: 'integer', nullable: false })
  zipCode: number;

  @Column({
    type: 'varchar',
    length: 60,
    nullable: false,
  })
  city: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  address: string;

  @Column({
    type: 'enum',
    enum: RegionsIso,
    nullable: false,
    default: RegionsIso.FRANCE,
  })
  codeCountry: RegionsIso;

  @Column({
    type: 'time',
    nullable: false,
  })
  openingTime: string;

  @Column({
    type: 'time',
    nullable: false,
  })
  closingTime: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 32,
  })
  phoneNumber: string;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  @DeleteDateColumn()
  deleteDate: Date;

  @OneToMany(() => MovieTheater, (movieTheater) => movieTheater.theater)
  moviesTheaters: MovieTheater[];
}
