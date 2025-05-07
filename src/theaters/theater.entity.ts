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
import { Exclude, Expose } from 'class-transformer';

@Entity()
@Exclude()
export class Theater {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({
    type: 'varchar',
    length: 250,
    nullable: false,
  })
  name: string;

  @Expose()
  @Column({ type: 'integer', nullable: false })
  zipCode: number;

  @Expose()
  @Column({
    type: 'varchar',
    length: 60,
    nullable: false,
  })
  city: string;

  @Expose()
  @Column({
    type: 'text',
    nullable: false,
  })
  address: string;

  @Expose()
  @Column({
    type: 'enum',
    enum: RegionsIso,
    nullable: false,
    default: RegionsIso.FRANCE,
  })
  codeCountry: RegionsIso;

  @Expose()
  @Column({
    type: 'time',
    nullable: false,
  })
  openingTime: string;

  @Expose()
  @Column({
    type: 'time',
    nullable: false,
  })
  closingTime: string;

  @Expose()
  @Column({
    type: 'varchar',
    nullable: false,
    length: 32,
  })
  phoneNumber: string;

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
  @OneToMany(() => MovieTheater, (movieTheater) => movieTheater.theater)
  moviesTheaters: MovieTheater[];
}
