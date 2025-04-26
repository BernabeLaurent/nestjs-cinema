import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { HashingProvider } from '../../auth/providers/hashing.provider';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async create(createUserDto: CreateUserDto) {
    let existingUser: User | null = null;
    // check user email exists
    try {
      existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment',
        { description: 'error connecting database' + error },
      );
    }

    // Exception if user exists
    if (existingUser) {
      throw new BadRequestException(
        'User already exists, please check your email',
      );
    }

    try {
      const newUser = this.usersRepository.create({
        ...createUserDto,
        password: await this.hashingProvider.hashPassword(
          createUserDto.password,
        ),
      });
      return await this.usersRepository.save(newUser);
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
