import { Test, TestingModule } from '@nestjs/testing';
import { PasswordResetEmailProvider } from './password-reset-email.provider';
import { EmailProvider } from '../../notifications/providers/email.provider';
import { RollbarService } from '../../common/services/rollbar.service';

describe('PasswordResetEmailProvider', () => {
  let provider: PasswordResetEmailProvider;

  const mockEmailProvider = {
    sendEmail: jest.fn().mockResolvedValue(undefined),
  };

  const mockRollbarService = {
    trackEvent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordResetEmailProvider,
        {
          provide: EmailProvider,
          useValue: mockEmailProvider,
        },
        {
          provide: RollbarService,
          useValue: mockRollbarService,
        },
      ],
    }).compile();

    provider = module.get<PasswordResetEmailProvider>(
      PasswordResetEmailProvider,
    );

    // Reset all mocks before each test
    jest.clearAllMocks();
    mockEmailProvider.sendEmail.mockResolvedValue(undefined);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('sendResetEmail', () => {
    const testEmail = 'test@example.com';
    const testToken = 'test-token-123';

    it('should send email and track success event', async () => {
      await provider.sendResetEmail(testEmail, testToken);

      expect(mockEmailProvider.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: testEmail,
          subject: 'Réinitialisation de votre mot de passe',
        }),
      );

      expect(mockRollbarService.trackEvent).toHaveBeenCalledWith(
        'password_reset_email_sent',
        {
          email_sent_to: testEmail,
          frontend_url: 'http://localhost:4200',
          result: 'success',
        },
        'info',
      );
    });

    it('should track error event when email sending fails', async () => {
      const error = new Error('Email sending failed');
      mockEmailProvider.sendEmail.mockRejectedValue(error);

      await expect(
        provider.sendResetEmail(testEmail, testToken),
      ).rejects.toThrow(error);

      expect(mockRollbarService.trackEvent).toHaveBeenCalledWith(
        'password_reset_email_failed',
        {
          email_intended_for: testEmail,
          error_message: 'Email sending failed',
          result: 'email_send_failed',
        },
        'error',
      );
    });

    it('should use default frontend URL when env var not set', async () => {
      const originalFrontendUrl = process.env.FRONTEND_URL;
      delete process.env.FRONTEND_URL;

      await provider.sendResetEmail(testEmail, testToken);

      expect(mockRollbarService.trackEvent).toHaveBeenCalledWith(
        'password_reset_email_sent',
        expect.objectContaining({
          frontend_url: 'http://localhost:4200',
        }),
        'info',
      );

      // Restore original env var
      if (originalFrontendUrl) {
        process.env.FRONTEND_URL = originalFrontendUrl;
      }
    });

    it('should include token in reset URL within email HTML', async () => {
      await provider.sendResetEmail(testEmail, testToken);

      expect(mockEmailProvider.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: testEmail,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          subject: expect.stringContaining('Réinitialisation'),
        }),
      );
      expect(mockEmailProvider.sendEmail).toHaveBeenCalledTimes(1);
    });
  });
});
