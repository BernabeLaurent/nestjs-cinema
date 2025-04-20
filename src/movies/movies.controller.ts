import { Controller, Get, Query, Param } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Languages } from '../common/enums/languages.enum';
import { RegionsIso } from '../common/enums/regions-iso.enum';

@Controller('movies')
@ApiTags('Movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @ApiOperation({ summary: 'Cherche un film' })
  @Get('search')
  @ApiResponse({
    status: 200,
    description: 'Movies found successfully',
  })
  public search(@Query('q') q: string) {
    return this.moviesService.search(q);
  }

  @ApiOperation({ summary: "Voir le détail d'un film" })
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Movie details found successfully',
  })
  public getDetails(@Param('id') id: string) {
    return this.moviesService.getDetails(id);
  }

  @ApiOperation({ summary: 'Recherche les prochaines sorties cinémas' })
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
  async getUpcoming(@Query() query: string) {
    return await this.moviesService.getUpcomingMovies(query);
  }
}
