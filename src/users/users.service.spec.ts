import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateGoogleUserProvider } from './providers/create-google-user.provider';
import { FindOneByGoogleIdProvider } from './providers/find-one-by-google-id.provider';
import { FindOneUserByEmailProvider } from './providers/find-one-user-by-email.provider';
import { CreateUserProvider } from './providers/create-user.provider';
import { UpdateUserProvider } from './providers/update-user.provider';
import { DataSource } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { RoleUser } from './enums/roles-users.enum';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const mockCreateUserProvider: Partial<CreateUserProvider> = {
      create: (createUserDto: CreateUserDto) =>
        Promise.resolve({
          id: 12,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          email: createUserDto.email,
          password: createUserDto.password,
          roleUser: createUserDto.roleUser,
          token: {
            accessToken: 'mockAccessToken',
            refreshToken: 'mockRefreshToken',
          },
          hasDisability: false,
          createDate: new Date(),
          updateDate: new Date(),
          deleteDate: new Date(),
          notifications: [],
          bookings: [],
          reviews: [],
        }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: CreateUserProvider, useValue: mockCreateUserProvider },
        { provide: DataSource, useValue: {} },
        { provide: getRepositoryToken(User), useValue: {} }, // Mock DataSource
        { provide: CreateGoogleUserProvider, useValue: {} },
        { provide: FindOneByGoogleIdProvider, useValue: {} },
        { provide: FindOneUserByEmailProvider, useValue: {} },
        { provide: UpdateUserProvider, useValue: {} },
      ],
    }).compile();

    service = module.get(UsersService);
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should be defined', () => {
      expect(service.create).toBeDefined();
    });
    it('should call create on createUserProvider', async () => {
      const user = await service.create({
        firstName: 'Jean',
        lastName: 'François',
        email: 'test@test.fr',
        password: 'passworD123#',
        roleUser: RoleUser.CUSTOMER,
        hasDisability: false,
      });

      expect(user.firstName).toEqual('Jean');
    });
  });
});
