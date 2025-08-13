import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from './auth.module';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { BcryptProvider } from './providers/bcrypt.provider';
import { HashingProvider } from './providers/hashing.provider';
import { SignInProvider } from './providers/sign-in.provider';
import { GenerateTokensProvider } from './providers/generate-tokens.provider';
import { RefreshTokensProvider } from './providers/refresh-tokens.provider';
import { GoogleAuthenticationController } from './social/google-authentication.controller';
import { GoogleAuthenticationService } from './social/providers/google-authentication.service';
import { GenerateTokenValidationBookingDetailProvider } from './providers/generate-token-validation-booking-detail.provider';

describe('AuthModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideModule(AuthModule)
      .useModule(AuthModule)
      .overrideProvider('UsersService')
      .useValue({})
      .overrideProvider('UserRepository')
      .useValue({})
      .compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide AuthController', () => {
    const controller = module.get<AuthController>(AuthController);
    expect(controller).toBeDefined();
  });

  it('should provide GoogleAuthenticationController', () => {
    const controller = module.get<GoogleAuthenticationController>(
      GoogleAuthenticationController,
    );
    expect(controller).toBeDefined();
  });

  it('should provide AuthService', () => {
    const service = module.get<AuthService>(AuthService);
    expect(service).toBeDefined();
  });

  it('should provide HashingProvider', () => {
    const provider = module.get<HashingProvider>(HashingProvider);
    expect(provider).toBeDefined();
  });

  it('should use BcryptProvider as HashingProvider implementation', () => {
    const provider = module.get<HashingProvider>(HashingProvider);
    expect(provider).toBeInstanceOf(BcryptProvider);
  });

  it('should provide SignInProvider', () => {
    const provider = module.get<SignInProvider>(SignInProvider);
    expect(provider).toBeDefined();
  });

  it('should provide GenerateTokensProvider', () => {
    const provider = module.get<GenerateTokensProvider>(GenerateTokensProvider);
    expect(provider).toBeDefined();
  });

  it('should provide RefreshTokensProvider', () => {
    const provider = module.get<RefreshTokensProvider>(RefreshTokensProvider);
    expect(provider).toBeDefined();
  });

  it('should provide GoogleAuthenticationService', () => {
    const service = module.get<GoogleAuthenticationService>(
      GoogleAuthenticationService,
    );
    expect(service).toBeDefined();
  });

  it('should provide GenerateTokenValidationBookingDetailProvider', () => {
    const provider = module.get<GenerateTokenValidationBookingDetailProvider>(
      GenerateTokenValidationBookingDetailProvider,
    );
    expect(provider).toBeDefined();
  });

  afterEach(async () => {
    await module.close();
  });
});
