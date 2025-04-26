import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CreateUserProvider } from './providers/create-user.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UpdateUserProvider } from './providers/update-user.provider';
import { FindOneUserByEmailProvider } from './providers/find-one-user-by-email.provider';
import { FindOneByGoogleIdProvider } from './providers/find-one-by-google-id.provider';
import { CreateGoogleUserProvider } from './providers/create-google-user.provider';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import profileConfig from './config/profile.config';

@Module({
  providers: [
    UsersService,
    CreateUserProvider,
    UpdateUserProvider,
    FindOneUserByEmailProvider,
    FindOneByGoogleIdProvider,
    CreateGoogleUserProvider,
  ],
  exports: [UsersService],
  controllers: [UsersController],
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    ConfigModule.forFeature(profileConfig),
  ],
})
export class UsersModule {}
