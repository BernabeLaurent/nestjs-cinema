import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleUser } from './enums/roles-users.enum';
import { RegionsIso } from '../common/enums/regions-iso.enum';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 64, nullable: false })
  firstName: string;

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

  @Column({ default: false, type: 'boolean', nullable: false })
  hasDisability: boolean;

  @Column({
    type: 'enum',
    enum: RoleUser,
    default: RoleUser.CUSTOMER,
    nullable: false,
  })
  roleUser: RoleUser;

  @Column({ length: 255, type: 'varchar', nullable: true })
  address?: string;

  @Column({ length: 60, type: 'varchar', nullable: true })
  city?: string;

  @Column({ type: 'integer', nullable: true })
  zipCode?: number;

  @Column({
    type: 'enum',
    enum: RegionsIso,
    nullable: true,
  })
  codeCountry?: RegionsIso;

  @Column({
    length: 32,
    nullable: true,
  })
  phoneNumber?: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  password: string;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  @DeleteDateColumn()
  deleteDate: Date;
}
