import { Body, Controller, HttpStatus, Patch, Post } from '@nestjs/common';
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
    status: 200,
    description: 'The session cinema has been successfully updated.',
  })
  @Auth(AuthType.None)
  @Patch()
  public updateSessionCinema(
    @Body() patchSessionCinemaDto: PatchSessionCinemaDto,
  ) {
    return this.sessionsCinemasService.updateSessionCinema(
      patchSessionCinemaDto,
    );
  }
}
