import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { UsersModule } from 'src/users/users.module';
import { BcryptProvider } from './providers/bcrypt.provider';
import { HashingProvider } from './providers/hashing.provider';
import { SignInProvider } from './providers/sign-in.provider';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { GenerateTokensProvider } from './providers/generate-tokens.provider';
import { RefreshTokensProvider } from './providers/refresh-tokens.provider';
import { GoogleAuthenticationController } from './social/google-authentication.controller';
import { GoogleAuthenticationService } from './social/providers/google-authentication.service';
import { GenerateTokenValidationBookingDetailProvider } from './providers/generate-token-validation-booking-detail.provider';
import { RollbarService } from '../common/services/rollbar.service';
import rollbarConfig from '../config/rollbar.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordResetToken } from './password-reset-token.entity';
import { User } from '../users/user.entity';
import { PasswordResetProvider } from './providers/password-reset.provider';
import { PasswordResetEmailProvider } from './providers/password-reset-email.provider';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  controllers: [AuthController, GoogleAuthenticationController],
  providers: [
    AuthService,
    { provide: HashingProvider, useClass: BcryptProvider },
    SignInProvider,
    GenerateTokensProvider,
    RefreshTokensProvider,
    GoogleAuthenticationService,
    GenerateTokenValidationBookingDetailProvider,
    RollbarService,
    PasswordResetProvider,
    PasswordResetEmailProvider,
  ],
  imports: [
    forwardRef(() => UsersModule),
    NotificationsModule,
    TypeOrmModule.forFeature([PasswordResetToken, User]),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(rollbarConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  exports: [
    AuthService,
    HashingProvider,
    GenerateTokenValidationBookingDetailProvider,
    GenerateTokensProvider,
  ],
})
export class AuthModule {}
