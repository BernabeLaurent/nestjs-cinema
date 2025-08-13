import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { SignInDto } from './dtos/signing.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signIn: jest.fn(),
    refreshTokens: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have authService injected', () => {
    expect(authService).toBeDefined();
  });

  describe('signIn', () => {
    it('should call authService.signIn with correct parameters', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResult = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      };

      mockAuthService.signIn.mockResolvedValue(mockResult);

      const result = await controller.signIn(signInDto);

      expect(mockAuthService.signIn).toHaveBeenCalledWith(signInDto);
      expect(mockAuthService.signIn).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResult);
    });

    it('should handle sign in errors', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const mockError = new Error('Invalid credentials');
      mockAuthService.signIn.mockRejectedValue(mockError);

      await expect(controller.signIn(signInDto)).rejects.toThrow(mockError);
      expect(mockAuthService.signIn).toHaveBeenCalledWith(signInDto);
    });
  });

  describe('refreshTokens', () => {
    it('should call authService.refreshTokens with correct parameters', async () => {
      const refreshTokenDto: RefreshTokenDto = {
        refreshToken: 'mock-refresh-token',
      };

      const mockResult = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      mockAuthService.refreshTokens.mockResolvedValue(mockResult);

      const result = await controller.refreshTokens(refreshTokenDto);

      expect(mockAuthService.refreshTokens).toHaveBeenCalledWith(
        refreshTokenDto,
      );
      expect(mockAuthService.refreshTokens).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResult);
    });

    it('should handle refresh token errors', async () => {
      const refreshTokenDto: RefreshTokenDto = {
        refreshToken: 'invalid-refresh-token',
      };

      const mockError = new Error('Invalid refresh token');
      mockAuthService.refreshTokens.mockRejectedValue(mockError);

      await expect(controller.refreshTokens(refreshTokenDto)).rejects.toThrow(
        mockError,
      );
      expect(mockAuthService.refreshTokens).toHaveBeenCalledWith(
        refreshTokenDto,
      );
    });
  });

  describe('method signatures', () => {
    it('should have signIn method', () => {
      expect(typeof controller.signIn).toBe('function');
    });

    it('should have refreshTokens method', () => {
      expect(typeof controller.refreshTokens).toBe('function');
    });
  });

  describe('controller dependencies', () => {
    it('should be instantiated with AuthService', () => {
      expect(controller['authService']).toBeDefined();
      expect(controller['authService']).toBe(authService);
    });
  });
});
