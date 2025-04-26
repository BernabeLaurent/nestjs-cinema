import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CreateUserProvider } from './providers/create-user.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UpdateUserProvider } from './providers/update-user.provider';

@Module({
  providers: [UsersService, CreateUserProvider, UpdateUserProvider],
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
