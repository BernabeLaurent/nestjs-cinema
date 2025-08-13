import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindOneByGoogleIdProvider } from './find-one-by-google-id.provider';
import { User } from '../user.entity';
import { RoleUser } from '../enums/roles-users.enum';

describe('FindOneByGoogleIdProvider', () => {
  let provider: FindOneByGoogleIdProvider;

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
        FindOneByGoogleIdProvider,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    provider = module.get<FindOneByGoogleIdProvider>(FindOneByGoogleIdProvider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('should find and return user by googleId', async () => {
    const googleId = '123456789';
    mockRepository.findOneBy.mockResolvedValue(mockUser);

    const result = await provider.findOneByGoogleId(googleId);

    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ googleId });
    expect(result).toEqual(mockUser);
  });

  it('should return null when user not found', async () => {
    const googleId = 'non-existent-id';
    mockRepository.findOneBy.mockResolvedValue(null);

    const result = await provider.findOneByGoogleId(googleId);

    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ googleId });
    expect(result).toBeNull();
  });

  it('should throw Error when repository throws an error', async () => {
    const googleId = '123456789';
    const error = new Error('Database connection failed');
    mockRepository.findOneBy.mockRejectedValue(error);

    await expect(provider.findOneByGoogleId(googleId)).rejects.toThrow(
      'Could not find user with this googleId',
    );
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ googleId });
  });

  it('should handle empty string googleId', async () => {
    const googleId = '';
    mockRepository.findOneBy.mockResolvedValue(null);

    const result = await provider.findOneByGoogleId(googleId);

    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ googleId: '' });
    expect(result).toBeNull();
  });

  it('should pass through the exact googleId parameter', async () => {
    const googleId = '987654321';
    mockRepository.findOneBy.mockResolvedValue(mockUser);

    await provider.findOneByGoogleId(googleId);

    expect(mockRepository.findOneBy).toHaveBeenCalledWith({
      googleId: '987654321',
    });
  });
});
