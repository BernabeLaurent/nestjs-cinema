import {
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';

@Injectable()
export class FindOneUserByEmailProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async findOneByEmail(email: string) {
    let user: User | null;

    try {
      user = await this.usersRepository.findOneBy({ email: email });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'pb de base',
      });
    }

    if (!user) {
      throw new UnauthorizedException('email inconnu');
    }
    return user;
  }
}
