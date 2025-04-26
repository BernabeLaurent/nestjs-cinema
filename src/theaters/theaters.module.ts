import { Module } from '@nestjs/common';
import { TheatersService } from './theaters.service';
import { TheatersController } from './theaters.controller';
import { CreateTheaterProvider } from './providers/create-theater.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Theater } from './theater.entity';

@Module({
  providers: [TheatersService, CreateTheaterProvider],
  controllers: [TheatersController],
  imports: [TypeOrmModule.forFeature([Theater])],
})
export class TheatersModule {}
