import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { AuthType } from '../auth/enums/auth-type.enum';
import { SessionsCinemasService } from './sessions-cinemas.service';
import { CreateSessionCinemaDto } from './dtos/create-session-cinema.dto';
import { PatchSessionCinemaDto } from './dtos/patch-session-cinema.dto';

@Controller('sessions-cinemas')
export class SessionsCinemasController {
  constructor(
    private readonly sessionsCinemasService: SessionsCinemasService,
  ) {}

  @Post('create')
  @ApiOperation({ summary: 'Créer une session de cinéma' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Session Cinema created successfully',
  })
  @Auth(AuthType.None)
  public createSessionCinema(
    @Body() createSessionCinemaDto: CreateSessionCinemaDto,
  ) {
    return this.sessionsCinemasService.createSessionCinema(
      createSessionCinemaDto,
    );
  }

  @ApiOperation({ summary: 'Updates a session cinema' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The session cinema has been successfully updated.',
  })
  @Auth(AuthType.None)
  @Patch(':id')
  public updateSessionCinema(
    @Param('id') id: number,
    @Body() patchSessionCinemaDto: PatchSessionCinemaDto,
  ) {
    return this.sessionsCinemasService.updateSessionCinema(
      id,
      patchSessionCinemaDto,
    );
  }

  @ApiOperation({ summary: "Voir le détail d'une séance de cinéma" })
  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Session cinema found successfully',
  })
  @Auth(AuthType.None)
  public getSessionCinema(@Param('id') id: number) {
    return this.sessionsCinemasService.getSessionCinemaById(id);
  }

  @ApiOperation({ summary: 'Retourne tous les séance de cinéma pour un film' })
  @Get('ByMovie/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sessions cinemas found successfully',
  })
  @Auth(AuthType.None)
  public getSessionsCinemasByMovieId(@Param('id') id: number) {
    return this.sessionsCinemasService.getSessionsCinemaByMovieId(id);
  }

  @ApiOperation({
    summary: 'Retourne tous les séance de cinéma pour une salle cinéma',
  })
  @Get('ByMovieTheater/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sessions cinemas found successfully',
  })
  @Auth(AuthType.None)
  public getSessionsCinemasByMovieTheaterId(@Param('id') id: number) {
    return this.sessionsCinemasService.getSessionsCinemaByMovieTheaterId(id);
  }

  @ApiOperation({
    summary: 'Retourne tous les séance de cinéma pour un cinéma',
  })
  @Get('ByMovieTheater/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sessions cinemas found successfully',
  })
  @Auth(AuthType.None)
  public getSessionsCinemasByTheaterId(@Param('id') id: number) {
    return this.sessionsCinemasService.getSessionsCinemaByTheaterId(id);
  }
}
