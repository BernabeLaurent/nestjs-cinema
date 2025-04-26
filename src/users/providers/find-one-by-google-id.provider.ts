import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FindOneByGoogleIdProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async findOneByGoogleId(googleId: string) {
    let user: User | null;

    try {
      user = await this.usersRepository.findOneBy({ googleId: googleId });
    } catch (error) {
      throw new Error('Could not find user with this googleId', {
        cause: error,
      });
    }
    return user;
  }
}
