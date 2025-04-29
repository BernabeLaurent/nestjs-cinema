import { Module } from '@nestjs/common';
import { SessionsCinemasService } from './sessions-cinemas.service';
import { SessionsCinemasController } from './sessions-cinemas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionCinema } from './session-cinema.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SessionCinema])],
  providers: [SessionsCinemasService],
  controllers: [SessionsCinemasController],
})
export class SessionsCinemasModule {}
