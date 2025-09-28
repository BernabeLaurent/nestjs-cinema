import { Test, TestingModule } from '@nestjs/testing';
import { PasswordResetProvider } from './password-reset.provider';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PasswordResetToken } from '../password-reset-token.entity';
import { User } from '../../users/user.entity';
import { BadRequestException } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import { RollbarService } from '../../common/services/rollbar.service';

describe('PasswordResetProvider', () => {
  let provider: PasswordResetProvider;

  const mockTokenRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const mockHashingProvider = {
    hashPassword: jest.fn(),
  };

  const mockRollbarService = {
    trackEvent: jest.fn(),
  };

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    roleUser: 'customer',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordResetProvider,
        {
          provide: getRepositoryToken(PasswordResetToken),
          useValue: mockTokenRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: HashingProvider,
          useValue: mockHashingProvider,
        },
        {
          provide: RollbarService,
          useValue: mockRollbarService,
        },
      ],
    }).compile();

    provider = module.get<PasswordResetProvider>(PasswordResetProvider);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('createResetToken', () => {
    it('should create reset token for existing user', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockTokenRepository.create.mockReturnValue({
        token: 'generated-token',
        user: mockUser,
        userId: mockUser.id,
        expiresAt: new Date(),
      });
      mockTokenRepository.save.mockResolvedValue({});
      mockTokenRepository.update.mockResolvedValue({});

      const token = await provider.createResetToken('test@example.com');

      expect(token).toBeDefined();
      expect(token).toHaveLength(64); // 32 bytes en hex = 64 caractères
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(mockTokenRepository.update).toHaveBeenCalledWith(
        { userId: mockUser.id, used: false },
        { used: true },
      );
      expect(mockTokenRepository.save).toHaveBeenCalled();
      expect(mockRollbarService.trackEvent).toHaveBeenCalledWith(
        'password_reset_request',
        {
          user_id: mockUser.id,
          email_exists: true,
          result: 'token_generated',
        },
        'info',
      );
    });

    it('should not reveal if email does not exist (anti-enumeration)', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await provider.createResetToken('nonexistent@test.com');

      expect(result).toBe('success');
      expect(mockTokenRepository.create).not.toHaveBeenCalled();
      expect(mockTokenRepository.save).not.toHaveBeenCalled();
      expect(mockRollbarService.trackEvent).toHaveBeenCalledWith(
        'password_reset_request',
        {
          email_exists: false,
          result: 'email_not_found',
        },
        'warning',
      );
    });

    it('should invalidate old tokens for user', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockTokenRepository.create.mockReturnValue({});
      mockTokenRepository.save.mockResolvedValue({});
      mockTokenRepository.update.mockResolvedValue({});

      await provider.createResetToken('test@example.com');

      expect(mockTokenRepository.update).toHaveBeenCalledWith(
        { userId: mockUser.id, used: false },
        { used: true },
      );
    });
  });

  describe('resetPassword', () => {
    const validToken = 'valid-token-123';
    const newPassword = 'NewPassword123!';
    const hashedPassword = 'hashed-password';

    const mockResetToken = {
      id: 1,
      token: validToken,
      userId: mockUser.id,
      user: mockUser,
      expiresAt: new Date(Date.now() + 3600000), // 1 heure dans le futur
      used: false,
    };

    beforeEach(() => {
      mockHashingProvider.hashPassword.mockResolvedValue(hashedPassword);
    });

    it('should reset password with valid token', async () => {
      mockTokenRepository.findOne.mockResolvedValue(mockResetToken);
      mockUserRepository.update.mockResolvedValue({});
      mockTokenRepository.update.mockResolvedValue({});

      await provider.resetPassword(validToken, newPassword);

      expect(mockTokenRepository.findOne).toHaveBeenCalledWith({
        where: { token: validToken, used: false },
        relations: ['user'],
      });
      expect(mockHashingProvider.hashPassword).toHaveBeenCalledWith(
        newPassword,
      );
      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser.id, {
        password: hashedPassword,
      });
      expect(mockTokenRepository.update).toHaveBeenCalledWith(
        mockResetToken.id,
        { used: true },
      );
      expect(mockRollbarService.trackEvent).toHaveBeenCalledWith(
        'password_reset_success',
        {
          user_id: mockUser.id,
          user_email: mockUser.email,
          user_role: mockUser.roleUser,
        },
        'info',
      );
    });

    it('should throw BadRequestException for invalid token', async () => {
      mockTokenRepository.findOne.mockResolvedValue(null);

      await expect(
        provider.resetPassword('invalid-token', newPassword),
      ).rejects.toThrow(BadRequestException);

      expect(mockUserRepository.update).not.toHaveBeenCalled();
      expect(mockTokenRepository.update).not.toHaveBeenCalled();
      expect(mockRollbarService.trackEvent).toHaveBeenCalledWith(
        'password_reset_attempt',
        {
          result: 'invalid_token',
          token_provided: true,
        },
        'warning',
      );
    });

    it('should throw BadRequestException for expired token', async () => {
      const expiredToken = {
        ...mockResetToken,
        expiresAt: new Date(Date.now() - 3600000), // 1 heure dans le passé
      };
      mockTokenRepository.findOne.mockResolvedValue(expiredToken);

      await expect(
        provider.resetPassword(validToken, newPassword),
      ).rejects.toThrow(BadRequestException);

      expect(mockUserRepository.update).not.toHaveBeenCalled();
      expect(mockTokenRepository.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException for already used token', async () => {
      mockTokenRepository.findOne.mockResolvedValue(null); // Car used: false dans la query

      await expect(
        provider.resetPassword(validToken, newPassword),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('validateResetToken', () => {
    it('should return true for valid unexpired token', async () => {
      const validToken = {
        id: 1,
        token: 'valid-token',
        expiresAt: new Date(Date.now() + 3600000), // 1 heure dans le futur
        used: false,
      };
      mockTokenRepository.findOne.mockResolvedValue(validToken);

      const result = await provider.validateResetToken('valid-token');

      expect(result).toBe(true);
      expect(mockTokenRepository.findOne).toHaveBeenCalledWith({
        where: { token: 'valid-token', used: false },
      });
    });

    it('should return false for expired token', async () => {
      const expiredToken = {
        id: 1,
        token: 'expired-token',
        expiresAt: new Date(Date.now() - 3600000), // 1 heure dans le passé
        used: false,
      };
      mockTokenRepository.findOne.mockResolvedValue(expiredToken);

      const result = await provider.validateResetToken('expired-token');

      expect(result).toBe(false);
    });

    it('should return false for non-existent token', async () => {
      mockTokenRepository.findOne.mockResolvedValue(null);

      const result = await provider.validateResetToken('nonexistent-token');

      expect(result).toBe(false);
    });

    it('should return false for used token', async () => {
      mockTokenRepository.findOne.mockResolvedValue(null); // Car used: false dans la query

      const result = await provider.validateResetToken('used-token');

      expect(result).toBe(false);
    });
  });
});
