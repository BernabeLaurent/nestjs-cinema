import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateGoogleUserProvider } from './create-google-user.provider';
import { User } from '../user.entity';
import { GoogleUser } from '../interfaces/google-user.interface';

describe('CreateGoogleUserProvider', () => {
  let provider: CreateGoogleUserProvider;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockGoogleUser: GoogleUser = {
    email: 'test@gmail.com',
    firstName: 'John',
    lastName: 'Doe',
    googleId: '123456789',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateGoogleUserProvider,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    provider = module.get(CreateGoogleUserProvider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('should create a Google user successfully', async () => {
    const mockUser = {
      id: 1,
      ...mockGoogleUser,
      password: 'generated-password',
    };
    mockRepository.create.mockReturnValue(mockUser);
    mockRepository.save.mockResolvedValue(mockUser);

    const result = await provider.createGoogleUser(mockGoogleUser);

    expect(mockRepository.create).toHaveBeenCalledWith({
      ...mockGoogleUser,
      password: expect.any(String) as string,
    });
    expect(mockRepository.save).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(mockUser);
    expect(result.password).toBeDefined();
  });

  it('should generate a password with correct properties', async () => {
    const mockUser = {
      id: 1,
      ...mockGoogleUser,
      password: 'generated-password',
    };
    mockRepository.create.mockReturnValue(mockUser);
    mockRepository.save.mockResolvedValue(mockUser);

    await provider.createGoogleUser(mockGoogleUser);

    const createCall = mockRepository.create.mock.calls[0] as [any];
    const generatedPassword = (createCall[0] as { password: string }).password;

    expect(generatedPassword).toBeDefined();
    expect(typeof generatedPassword).toBe('string');
    expect(generatedPassword.length).toBe(12);
  });

  it('should throw ConflictException when repository throws an error', async () => {
    const error = new Error('Database error');
    mockRepository.create.mockReturnValue({});
    mockRepository.save.mockRejectedValue(error);

    await expect(provider.createGoogleUser(mockGoogleUser)).rejects.toThrow(
      ConflictException,
    );
    await expect(provider.createGoogleUser(mockGoogleUser)).rejects.toThrow(
      'Could not create user',
    );
  });

  it('should throw ConflictException when create method throws an error', async () => {
    const error = new Error('Create error');
    mockRepository.create.mockImplementation(() => {
      throw error;
    });

    await expect(provider.createGoogleUser(mockGoogleUser)).rejects.toThrow(
      ConflictException,
    );
  });
});
