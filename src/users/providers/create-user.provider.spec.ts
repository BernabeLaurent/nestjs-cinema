import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserProvider } from './create-user.provider';
import { DataSource, IsNull, ObjectLiteral, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { HashingProvider } from '../../auth/providers/hashing.provider';
import { GenerateTokensProvider } from '../../auth/providers/generate-tokens.provider';
import { NotificationsService } from '../../notifications/notifications.service';
import { RoleUser } from '../enums/roles-users.enum';
import { BadRequestException } from '@nestjs/common';

type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;
const createMockRepository = <
  T extends ObjectLiteral = any,
>(): MockRepository<T> => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

describe('CreateUserProvider', () => {
  let provider: CreateUserProvider;

  let usersRepository: MockRepository;

  const user = {
    firstName: 'Bob',
    lastName: 'Léponge',
    email: 'test@test.fr',
    password: 'passworD123%',
    roleUser: RoleUser.CUSTOMER,
    hasDisability: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserProvider,
        { provide: DataSource, useValue: {} },
        { provide: getRepositoryToken(User), useValue: createMockRepository() },
        {
          provide: HashingProvider,
          useValue: {
            hashPassword: jest.fn(() => user.password),
          },
        },
        {
          provide: GenerateTokensProvider,
          useValue: {
            generateTokens: jest.fn(() => Promise.resolve()),
          },
        },
        {
          provide: NotificationsService,
          useValue: {
            sendTemplatedEmail: jest.fn(() => Promise.resolve()),
          },
        },
      ],
    }).compile();

    provider = module.get<CreateUserProvider>(CreateUserProvider);
    usersRepository = module.get(getRepositoryToken(User));
  });

  it('Should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('createUser', () => {
    describe('when the user does not exist', () => {
      it('should create a new user', async () => {
        usersRepository.findOne!.mockReturnValue(null);
        usersRepository.create!.mockReturnValue(user);
        usersRepository.save!.mockReturnValue(user);
        await provider.create(user);
        expect(usersRepository.findOne).toHaveBeenCalledWith({
          where: { email: user.email, deleteDate: IsNull() },
        });
        expect(usersRepository.create).toHaveBeenCalledWith(user);
        expect(usersRepository.save).toHaveBeenCalledWith(user);
      });
    });
    describe('when the user already exists', () => {
      it('throw BadRequestException', async () => {
        usersRepository.findOne!.mockReturnValue(user.email);
        usersRepository.create!.mockReturnValue(user);
        usersRepository.save!.mockReturnValue(user);

        try {
          await provider.create(user);
        } catch (e) {
          expect(e).toBeInstanceOf(BadRequestException);
        }
      });
    });
  });
});
