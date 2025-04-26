import { ConflictException, Injectable } from '@nestjs/common';
import { CreateTheaterDto } from '../dtos/create-theater.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Theater } from '../theater.entity';

@Injectable()
export class CreateTheaterProvider {
  constructor(
    @InjectRepository(Theater)
    private readonly theatersRepository: Repository<Theater>,
  ) {}

  public async create(createTheaterDto: CreateTheaterDto) {
    try {
      this.theatersRepository.create(createTheaterDto);
      return await this.theatersRepository.save(createTheaterDto);
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
