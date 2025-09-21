import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { GenerateTokenValidationBookingDetailProvider } from './generate-token-validation-booking-detail.provider';
import jwtConfig from '../config/jwt.config';

describe('GenerateTokenValidationBookingDetailProvider', () => {
  let provider: GenerateTokenValidationBookingDetailProvider;

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockJwtConfig = {
    secret: 'test-secret',
    audience: 'test-audience',
    issuer: 'test-issuer',
    accessTokenTtl: 3600,
    refreshTokenTtl: 86400,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenerateTokenValidationBookingDetailProvider,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: jwtConfig.KEY,
          useValue: mockJwtConfig,
        },
      ],
    }).compile();

    provider = module.get(GenerateTokenValidationBookingDetailProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
