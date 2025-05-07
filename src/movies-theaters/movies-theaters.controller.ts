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
import { MoviesTheatersService } from './movies-theaters.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { AuthType } from '../auth/enums/auth-type.enum';
import { CreateMovieTheaterDto } from './dtos/create-movie-theater.dto';
import { PatchMovieTheaterDto } from './dtos/patch-movie-theater.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleUser } from '../users/enums/roles-users.enum';

@Controller('movies-theaters')
@Auth(AuthType.Bearer)
export class MoviesTheatersController {
  constructor(private readonly moviesTheaterService: MoviesTheatersService) {}

  @ApiOperation({ summary: 'Cherche une salle de cinéma par son ID' })
  @Get('search/:movieTheaterId')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'MovieTheater found successfully',
  })
  @Auth(AuthType.None)
  public getMovieTheater(@Param('movieTheaterId') movieTheaterId: number) {
    return this.moviesTheaterService.getMovieTheaterById(movieTheaterId);
  }

  @ApiOperation({ summary: 'Cherche les salle de cinéma par ID de cinéma' })
  @Get('search_by_theater/:theaterId')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'MovieTheater[] found successfully',
  })
  @Auth(AuthType.None)
  public getMoviesTheatersByTheaterId(@Param('theaterId') theaterId: number) {
    return this.moviesTheaterService.getMoviesTheatersByTheaterId(theaterId);
  }

  @Post('create')
  @ApiOperation({ summary: 'Créer une salle de cinéma' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'MovieTheater created successfully',
  })
  @Roles([RoleUser.ADMIN])
  public createMovieTheater(
    @Body() createMovieTheaterDto: CreateMovieTheaterDto,
  ) {
    return this.moviesTheaterService.createMovieTheater(createMovieTheaterDto);
  }

  @ApiOperation({ summary: 'Updates a movie theater' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The movie Theater has been successfully updated.',
  })
  @Patch(':id')
  @Roles([RoleUser.ADMIN])
  public updateMovieTheater(
    @Param('id') id: number,
    @Body() patchMovieTheaterDto: PatchMovieTheaterDto,
  ) {
    return this.moviesTheaterService.updateMovieTheater(
      id,
      patchMovieTheaterDto,
    );
  }
}
