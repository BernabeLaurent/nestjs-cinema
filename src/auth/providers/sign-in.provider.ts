import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/signing.dto';
import { UsersService } from 'src/users/users.service';
import { HashingProvider } from './hashing.provider';
import { GenerateTokensProvider } from './generate-tokens.provider';

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private hashingProvider: HashingProvider, // Assuming you have a HashingProvider for password hashing

    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  public async signIn(signInDto: SignInDto) {
    // Find user using email ID
    // Exception if user not found
    const user = await this.usersService.findOneByEmail(signInDto.email);

    // Check password using hashing provider with compare
    let isEqual: boolean = false;
    if (user.password) {
      try {
        isEqual = await this.hashingProvider.comparePassword(
          signInDto.password,
          user.password || '',
        );
      } catch (error) {
        throw new RequestTimeoutException(error, {
          description: 'pb de base',
        });
      }
    }

    if (!isEqual) {
      throw new UnauthorizedException('password incorrect');
    }

    return await this.generateTokensProvider.generateTokens(user);
  }
}
