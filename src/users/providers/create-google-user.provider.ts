import { ConflictException, Injectable } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GoogleUser } from '../interfaces/google-user.interface';
import * as generatePassword from 'generate-password';

@Injectable()
export class CreateGoogleUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async createGoogleUser(googleUser: GoogleUser) {
    try {
      const password = generatePassword.generate({
        length: 12,
        numbers: true,
        symbols: true,
        uppercase: true,
        lowercase: true,
        strict: true,
      });
      const user = this.usersRepository.create({
        ...googleUser,
        password,
      } as DeepPartial<User>);
      return await this.usersRepository.save(user);
    } catch (error) {
      throw new ConflictException(error, {
        description: 'Could not create user',
      });
    }
  }
}
