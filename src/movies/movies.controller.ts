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

@Controller('movies')
@ApiTags('Movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @ApiOperation({ summary: 'Cherche un film sur le service externe' })
  @Get('search')
  @ApiResponse({
    status: 200,
    description: 'Movies found successfully',
  })
  public searchExternal(@Query('q') q: string) {
    return this.moviesService.search(q);
  }

  @ApiOperation({ summary: "Voir le détail d'un film sur le service externe" })
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Movie details found successfully',
  })
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
    example: Languages.FRANCE,
  })
  @ApiQuery({
    name: 'region',
    enum: RegionsIso,
    required: false,
    description: 'Région sélectionnée',
    example: RegionsIso.FRANCE,
  })
  @ApiResponse({
    status: 200,
    description: 'Movies found successfully',
  })
  @Get('search/upcoming')
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
    status: 200,
    description: 'Movie found successfully',
  })
  public getMovie(@Param('movieId') movieId: number) {
    return this.moviesService.getMovieById(movieId);
  }

  @ApiOperation({ summary: 'Updates a movie' })
  @ApiResponse({
    status: 200,
    description: 'The movie has been successfully updated.',
  })
  @Patch()
  public updateMovie(@Body() patchMovieDto: PatchMovieDto) {
    return this.moviesService.updateMovie(patchMovieDto);
  }

  @ApiOperation({ summary: 'Créer une note de film' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Movie Review created successfully',
  })
  @Auth(AuthType.None)
  @Post('create-review')
  public createReviewMovie(@Body() createReviewMovieDto: CreateReviewMovieDto) {
    return this.moviesService.createMovieReview(createReviewMovieDto);
  }
}
