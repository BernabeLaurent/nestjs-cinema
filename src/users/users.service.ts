import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { CreateUserProvider } from './providers/create-user.provider';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UpdateUserProvider } from './providers/update-user.provider';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    private readonly createUserProvider: CreateUserProvider,
    private readonly updateUserProvider: UpdateUserProvider,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async create(createUserDto: CreateUserDto) {
    return await this.createUserProvider.create(createUserDto);
  }

  public async update(patchUserDto: PatchUserDto) {
    return await this.updateUserProvider.update(patchUserDto);
  }

  public async delete(id: number) {
    let user: User | null;

    // On recherche si l'user existe
    try {
      user = await this.usersRepository.findOneBy({
        id: id,
      });
    } catch (error) {
      throw new RequestTimeoutException('unable to process your request', {
        description: 'error connecting database' + error,
      });
    }
    if (!user) {
      throw new BadRequestException('user not found WITH THIS ID');
    }
    try {
      await this.usersRepository.softDelete(id);
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
