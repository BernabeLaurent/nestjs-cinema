import { Test, TestingModule } from '@nestjs/testing';
import { RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindOneUserByEmailProvider } from './find-one-user-by-email.provider';
import { User } from '../user.entity';
import { RoleUser } from '../enums/roles-users.enum';

describe('FindOneUserByEmailProvider', () => {
  let provider: FindOneUserByEmailProvider;

  const mockRepository = {
    findOneBy: jest.fn(),
  };

  const mockUser: Partial<User> = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    googleId: '123456789',
    hasDisability: false,
    roleUser: RoleUser.CUSTOMER,
    password: 'hashed-password',
    createDate: new Date(),
    updateDate: new Date(),
    notifications: [],
    reviews: [],
    bookings: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindOneUserByEmailProvider,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    provider = module.get<FindOneUserByEmailProvider>(
      FindOneUserByEmailProvider,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('should find and return user by email', async () => {
    const email = 'john.doe@example.com';
    mockRepository.findOneBy.mockResolvedValue(mockUser);

    const result = await provider.findOneByEmail(email);

    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ email });
    expect(result).toEqual(mockUser);
  });

  it('should throw UnauthorizedException when user not found', async () => {
    const email = 'nonexistent@example.com';
    mockRepository.findOneBy.mockResolvedValue(null);

    await expect(provider.findOneByEmail(email)).rejects.toThrow(
      UnauthorizedException,
    );
    await expect(provider.findOneByEmail(email)).rejects.toThrow(
      'email inconnu',
    );
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ email });
  });

  it('should throw RequestTimeoutException when repository throws an error', async () => {
    const email = 'john.doe@example.com';
    const error = new Error('Database connection failed');
    mockRepository.findOneBy.mockRejectedValue(error);

    await expect(provider.findOneByEmail(email)).rejects.toThrow(
      RequestTimeoutException,
    );
    await expect(provider.findOneByEmail(email)).rejects.toThrow('pb de base');
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ email });
  });

  it('should handle different email formats', async () => {
    const email = 'test@domain.co.uk';
    mockRepository.findOneBy.mockResolvedValue(mockUser);

    const result = await provider.findOneByEmail(email);

    expect(mockRepository.findOneBy).toHaveBeenCalledWith({
      email: 'test@domain.co.uk',
    });
    expect(result).toEqual(mockUser);
  });

  it('should handle empty string email by throwing UnauthorizedException', async () => {
    const email = '';
    mockRepository.findOneBy.mockResolvedValue(null);

    await expect(provider.findOneByEmail(email)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ email: '' });
  });

  it('should pass through the exact email parameter', async () => {
    const email = 'exact.test@example.com';
    mockRepository.findOneBy.mockResolvedValue(mockUser);

    await provider.findOneByEmail(email);

    expect(mockRepository.findOneBy).toHaveBeenCalledWith({
      email: 'exact.test@example.com',
    });
  });
});
