import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
  BadRequestException,
  Inject,
  forwardRef,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { IsNull, Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { HashingProvider } from '../../auth/providers/hashing.provider';
import { GenerateTokensProvider } from '../../auth/providers/generate-tokens.provider';
import { NotificationsService } from '../../notifications/notifications.service';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
    private readonly generateTokensProvider: GenerateTokensProvider,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
  ) {}

  private readonly logger = new Logger(CreateUserProvider.name, {
    timestamp: true,
  });

  public async create(createUserDto: CreateUserDto) {
    this.logger.log('create' + JSON.stringify(createUserDto));

    let existingUser: User | null = null;
    // check user email exists
    try {
      existingUser = await this.usersRepository.findOne({
        where: {
          email: createUserDto.email,
          deleteDate: IsNull(), // vérifier que l'utilisateur n'est pas soft-deleted
        },
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment',
        { description: 'error connecting database' + error },
      );
    }
    this.logger.log('existingUser' + JSON.stringify(existingUser));

    // Exception if user exists
    if (existingUser) {
      throw new BadRequestException(
        'User already exists, please check your email',
      );
    }

    // Vérifie s'il existe un utilisateur supprimé
    const deletedUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
      withDeleted: true,
    });

    this.logger.log('deletedUser' + JSON.stringify(deletedUser));

    if (deletedUser) {
      throw new HttpException(
        {
          statusCode: HttpStatus.CONFLICT,
          message: `user deleted found WITH THIS email: ${createUserDto.email}`,
          error: 'Bad Request',
        },
        HttpStatus.CONFLICT,
      );
    }

    try {
      const hashedPassword = await this.hashingProvider.hashPassword(
        createUserDto.password,
      );
      this.logger.log('hashedPassword: ' + hashedPassword);
      const newUser = this.usersRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });
      this.logger.log('newUser' + JSON.stringify(newUser));

      const user = await this.usersRepository.save(newUser);
      const token = await this.generateTokensProvider.generateTokens(user);

      try {
        await this.notificationsService.sendTemplatedEmail(
          user.id,
          user.email,
          'Inscription confirmée',
          'confirmation_inscription',
          {
            firstName: user.firstName,
            lastName: user.lastName,
            appName: 'MyApp',
            year: new Date().getFullYear(),
          },
        );
      } catch (error) {
        // Log the error but don't fail the registration
        this.logger.error('Failed to send confirmation email:', error);
      }

      return {
        ...user,
        token,
      };
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
