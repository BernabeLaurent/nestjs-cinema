import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PatchUserDto } from '../dtos/patch-user.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UpdateUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async update(patchUserDto: PatchUserDto) {
    let user: User | null;

    // On recherche si l'user existe
    try {
      user = await this.usersRepository.findOneBy({
        id: patchUserDto.id,
      });
    } catch (error) {
      throw new RequestTimeoutException('unable to process your request', {
        description: 'error connecting database' + error,
      });
    }
    if (!user) {
      throw new BadRequestException('User not found WITH THIS ID');
    }

    // Update the properties of the user
    user.lastName = patchUserDto.lastName ?? user.lastName;
    user.firstName = patchUserDto.firstName ?? user.firstName;
    user.city = patchUserDto.city ?? user.city;
    user.address = patchUserDto.address ?? user.address;
    user.codeCountry = patchUserDto.codeCountry ?? user.codeCountry;
    user.zipCode = patchUserDto.zipCode ?? user.zipCode;
    user.hasDisability = patchUserDto.hasDisability ?? user.hasDisability;
    user.phoneNumber = patchUserDto.phoneNumber ?? user.phoneNumber;
    user.googleId = patchUserDto.googleId ?? user.googleId;
    user.password = patchUserDto.password ?? user.password;
    user.roleUser = patchUserDto.roleUser ?? user.roleUser;

    // save the post and return it
    try {
      await this.usersRepository.save(user);
    } catch (error) {
      throw new RequestTimeoutException('unable to process your request', {
        description: 'error connecting database' + error,
      });
    }
    return user;
  }
}
