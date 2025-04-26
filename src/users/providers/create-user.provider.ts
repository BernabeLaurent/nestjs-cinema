import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async create(createUserDto: CreateUserDto) {
    try {
      this.usersRepository.create(createUserDto);
      return await this.usersRepository.save(createUserDto);
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
