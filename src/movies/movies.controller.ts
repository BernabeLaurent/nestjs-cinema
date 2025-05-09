import {
  Controller,
  Get,
  Query,
  Param,
  Patch,
  Body,
  Post,
  HttpStatus,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Languages } from '../common/enums/languages.enum';
import { RegionsIso } from '../common/enums/regions-iso.enum';
import { PatchMovieDto } from './dtos/patch-movie.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { AuthType } from '../auth/enums/auth-type.enum';
import { CreateReviewMovieDto } from './dtos/create-review-movie.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleUser } from '../users/enums/roles-users.enum';
import { ValidateReviewMovieDto } from './dtos/validate-review-movie.dto';

@Controller('movies')
@ApiTags('Movies')
@Auth(AuthType.Bearer)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @ApiOperation({ summary: 'Cherche un film sur le service externe' })
  @Get('search')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Movies found successfully',
  })
  @Roles([RoleUser.ADMIN])
  public searchExternal(@Query('q') q: string) {
    return this.moviesService.search(q);
  }

  @ApiOperation({
    summary: 'Cherche le casting du film sur le service externe',
  })
  @Get('getCast/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cast found successfully',
  })
  @Roles([RoleUser.ADMIN])
  public searchExternalCast(@Param('id') movieExternalId: number) {
    return this.moviesService.getCast(movieExternalId);
  }

  @ApiOperation({ summary: "Voir le détail d'un film sur le service externe" })
  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Movie details found successfully',
  })
  @Roles([RoleUser.ADMIN])
  public getDetailsExternal(@Param('id') id: number) {
    return this.moviesService.getDetails(id);
  }

  @ApiOperation({
    summary: 'Recherche les prochaines sorties cinémas sur le service externe',
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    description: 'Retourne la page de résultats',
    example: 1,
  })
  @ApiQuery({
    name: 'language',
    enum: Languages,
    required: false,
    description: 'Langue sélectionnée',
    example: Languages.FRENCH,
  })
  @ApiQuery({
    name: 'region',
    enum: RegionsIso,
    required: false,
    description: 'Région sélectionnée',
    example: RegionsIso.FRANCE,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Movies found successfully',
  })
  @Get('search/upcoming')
  // @Roles([RoleUser.ADMIN])
  @Auth(AuthType.None)
  public getUpcomingMoviesExternal(
    @Query('region') region?: RegionsIso,
    @Query('language') language?: Languages,
    @Query('page') page?: number,
  ) {
    return this.moviesService.getUpcomingMovies(region, language, page);
  }

  @ApiOperation({ summary: 'Cherche un film par son ID' })
  @Get('search/:movieId')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Movie found successfully',
  })
  @Auth(AuthType.None)
  public getMovie(@Param('movieId') movieId: number) {
    return this.moviesService.getMovieById(movieId);
  }

  @ApiOperation({ summary: 'Updates a movie' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The movie has been successfully updated.',
  })
  @Patch(':movieId')
  @Roles([RoleUser.ADMIN])
  public updateMovie(
    @Param('movieId') movieId: number,
    @Body() patchMovieDto: PatchMovieDto,
  ) {
    return this.moviesService.updateMovie(movieId, patchMovieDto);
  }

  @ApiOperation({ summary: 'Créer une note de film' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Movie Review created successfully',
  })
  @Post('create-review')
  public createReviewMovie(@Body() createReviewMovieDto: CreateReviewMovieDto) {
    return this.moviesService.createMovieReview(createReviewMovieDto);
  }

  @ApiOperation({ summary: 'Valide ou invalide une review de film' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The movie review has been successfully validated.',
  })
  @Patch('reviews/:reviewId/validate')
  @Roles([RoleUser.ADMIN])
  public validateMovieReview(
    @Param('reviewId') reviewId: number,
    @Body() validateReviewMovieDto: ValidateReviewMovieDto,
  ) {
    return this.moviesService.validateMovieReview(
      reviewId,
      validateReviewMovieDto,
    );
  }

  @ApiOperation({
    summary: "Récupère une review spécifique d'un utilisateur pour un film",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The movie review has been successfully retrieved.',
  })
  @Get('reviews/:movieId/:userId')
  public getMovieReview(
    @Param('movieId') movieId: number,
    @Param('userId') userId: number,
  ) {
    return this.moviesService.getMovieReview(movieId, userId);
  }

  @ApiOperation({
    summary: "Récupère toutes les reviews d'un film",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The movie reviews have been successfully retrieved.',
  })
  @Auth(AuthType.None)
  @Get('reviews/:movieId')
  public getMovieReviews(@Param('movieId') movieId: number) {
    return this.moviesService.getMovieReviews(movieId);
  }
}
