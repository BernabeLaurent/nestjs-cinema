import {
  Injectable,
  RequestTimeoutException,
  BadRequestException,
} from '@nestjs/common';
import { CreateTheaterDto } from './dtos/create-theater.dto';
import { CreateTheaterProvider } from './providers/create-theater.provider';
import { PatchTheaterDto } from './dtos/patch-theater.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Theater } from './theater.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TheatersService {
  constructor(
    private readonly createTheaterProvider: CreateTheaterProvider,
    @InjectRepository(Theater)
    private readonly theatersRepository: Repository<Theater>,
  ) {}

  /**
   * Retrouve un user par son id
   * @param id L'id du user
   * @returns L'user
   */
  public async findOneById(id: number) {
    let theater: Theater | null;

    // On recherche si le cinéma existe
    try {
      theater = await this.theatersRepository.findOneBy({
        id: id,
      });
    } catch (error) {
      throw new RequestTimeoutException('unable to process your request', {
        description: 'error connecting database' + error,
      });
    }
    if (!theater) {
      throw new BadRequestException('Theater not found WITH THIS ID');
    }
    return theater;
  }

  public async create(createTheaterDto: CreateTheaterDto) {
    return await this.createTheaterProvider.create(createTheaterDto);
  }

  public async update(id: number, patchTheaterDto: PatchTheaterDto) {
    let theater: Theater | null;

    // On recherche si le cinéma existe
    try {
      theater = await this.theatersRepository.findOneBy({
        id: id,
      });
    } catch (error) {
      throw new RequestTimeoutException('unable to process your request', {
        description: 'error connecting database' + error,
      });
    }
    if (!theater) {
      throw new BadRequestException('Theater not found WITH THIS ID');
    }

    // Update the properties of the theater
    theater.name = patchTheaterDto.name ?? theater.name;
    theater.zipCode = patchTheaterDto.zipCode ?? theater.zipCode;
    theater.city = patchTheaterDto.city ?? theater.city;
    theater.address = patchTheaterDto.name ?? theater.address;
    theater.codeCountry = patchTheaterDto.codeCountry ?? theater.codeCountry;
    theater.openingTime = patchTheaterDto.openingTime ?? theater.openingTime;
    theater.closingTime = patchTheaterDto.closingTime ?? theater.closingTime;
    theater.phoneNumber = patchTheaterDto.phoneNumber ?? theater.phoneNumber;

    // save the post and return it
    try {
      await this.theatersRepository.save(theater);
    } catch (error) {
      throw new RequestTimeoutException('unable to process your request', {
        description: 'error connecting database' + error,
      });
    }
    return theater;
  }

  public async delete(id: number) {
    let theater: Theater | null;

    // On recherche si le cinéma existe
    try {
      theater = await this.theatersRepository.findOneBy({
        id: id,
      });
    } catch (error) {
      throw new RequestTimeoutException('unable to process your request', {
        description: 'error connecting database' + error,
      });
    }
    if (!theater) {
      throw new BadRequestException('Theater not found WITH THIS ID');
    }
    try {
      await this.theatersRepository.softDelete(id);
    } catch (error) {
      throw new RequestTimeoutException('unable to process your request', {
        description: 'error connecting database' + error,
      });
    }

    // confirmation
    return {
      deleted: true,
      id,
    };
  }
}
