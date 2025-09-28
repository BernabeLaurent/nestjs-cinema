import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { PasswordResetProvider } from './providers/password-reset.provider';
import { PasswordResetEmailProvider } from './providers/password-reset-email.provider';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { BadRequestException } from '@nestjs/common';

describe('AuthController - Password Reset', () => {
  let controller: AuthController;

  const mockAuthService = {
    signIn: jest.fn(),
    refreshTokens: jest.fn(),
  };

  const mockPasswordResetProvider = {
    createResetToken: jest.fn(),
    resetPassword: jest.fn(),
    validateResetToken: jest.fn(),
  };

  const mockPasswordResetEmailProvider = {
    sendResetEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: PasswordResetProvider,
          useValue: mockPasswordResetProvider,
        },
        {
          provide: PasswordResetEmailProvider,
          useValue: mockPasswordResetEmailProvider,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('forgotPassword', () => {
    const forgotPasswordDto: ForgotPasswordDto = {
      email: 'test@example.com',
    };

    it('should send reset email for existing user', async () => {
      const token = 'generated-token-123';
      mockPasswordResetProvider.createResetToken.mockResolvedValue(token);
      mockPasswordResetEmailProvider.sendResetEmail.mockResolvedValue(
        undefined,
      );

      const result = await controller.forgotPassword(forgotPasswordDto);

      expect(mockPasswordResetProvider.createResetToken).toHaveBeenCalledWith(
        forgotPasswordDto.email,
      );
      expect(
        mockPasswordResetEmailProvider.sendResetEmail,
      ).toHaveBeenCalledWith(forgotPasswordDto.email, token);
      expect(result).toEqual({
        message:
          'Si cette adresse email existe, un lien de réinitialisation a été envoyé.',
      });
    });

    it('should not send email for non-existent user but return same message', async () => {
      mockPasswordResetProvider.createResetToken.mockResolvedValue('success');

      const result = await controller.forgotPassword(forgotPasswordDto);

      expect(mockPasswordResetProvider.createResetToken).toHaveBeenCalledWith(
        forgotPasswordDto.email,
      );
      expect(
        mockPasswordResetEmailProvider.sendResetEmail,
      ).not.toHaveBeenCalled();
      expect(result).toEqual({
        message:
          'Si cette adresse email existe, un lien de réinitialisation a été envoyé.',
      });
    });

    it('should handle email service errors', async () => {
      const token = 'generated-token-123';
      mockPasswordResetProvider.createResetToken.mockResolvedValue(token);
      mockPasswordResetEmailProvider.sendResetEmail.mockRejectedValue(
        new Error('Email service error'),
      );

      await expect(
        controller.forgotPassword(forgotPasswordDto),
      ).rejects.toThrow('Email service error');
    });
  });

  describe('resetPassword', () => {
    const resetPasswordDto: ResetPasswordDto = {
      token: 'valid-token-123',
      newPassword: 'NewPassword123!',
    };

    it('should reset password with valid token', async () => {
      mockPasswordResetProvider.resetPassword.mockResolvedValue(undefined);

      const result = await controller.resetPassword(resetPasswordDto);

      expect(mockPasswordResetProvider.resetPassword).toHaveBeenCalledWith(
        resetPasswordDto.token,
        resetPasswordDto.newPassword,
      );
      expect(result).toEqual({
        message:
          'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.',
      });
    });

    it('should throw BadRequestException for invalid token', async () => {
      mockPasswordResetProvider.resetPassword.mockRejectedValue(
        new BadRequestException('Token invalide ou expiré'),
      );

      await expect(controller.resetPassword(resetPasswordDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for expired token', async () => {
      mockPasswordResetProvider.resetPassword.mockRejectedValue(
        new BadRequestException('Token expiré'),
      );

      await expect(controller.resetPassword(resetPasswordDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('validateResetToken', () => {
    it('should return true for valid token', async () => {
      const token = 'valid-token-123';
      mockPasswordResetProvider.validateResetToken.mockResolvedValue(true);

      const result = await controller.validateResetToken(token);

      expect(mockPasswordResetProvider.validateResetToken).toHaveBeenCalledWith(
        token,
      );
      expect(result).toEqual({ valid: true });
    });

    it('should return false for invalid token', async () => {
      const token = 'invalid-token-123';
      mockPasswordResetProvider.validateResetToken.mockResolvedValue(false);

      const result = await controller.validateResetToken(token);

      expect(mockPasswordResetProvider.validateResetToken).toHaveBeenCalledWith(
        token,
      );
      expect(result).toEqual({ valid: false });
    });

    it('should return false for expired token', async () => {
      const token = 'expired-token-123';
      mockPasswordResetProvider.validateResetToken.mockResolvedValue(false);

      const result = await controller.validateResetToken(token);

      expect(result).toEqual({ valid: false });
    });
  });
});
