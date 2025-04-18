import { Controller, Get, Query, Param } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('movies')
@ApiTags('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @ApiOperation({ summary: 'Cherche un film' })
  @Get('search')
  public search(@Query('q') q: string) {
    console.log(q);
    return this.moviesService.search(q);
  }

  @ApiOperation({ summary: "Voir le détail d'un film" })
  @Get(':id')
  public getDetails(@Param('id') id: string) {
    console.log(id);
    return this.moviesService.getDetails(id);
  }
}
