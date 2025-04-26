import {
  Body,
  Controller,
  Delete, Get, Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTheaterDto } from './dtos/create-theater.dto';
import { TheatersService } from './theaters.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PatchTheaterDto } from './dtos/patch-theater.dto';
import { GetTheaterDto } from './dtos/get-theater.dto';

@Controller('theaters')
@ApiTags('Theaters')
export class TheatersController {
  constructor(private readonly theatersService: TheatersService) {}

  @Get('{/:id}')
  @ApiOperation({ summary: 'Get Theater by ID' })
  @ApiResponse({
    status: 200,
    description: 'User found successfully',
  })
  public getTheater(@Param() getTheaterDto: GetTheaterDto) {
    return this.theatersService.findOneById(getTheaterDto.id);
  }

  @ApiOperation({ summary: 'Create a new theater' })
  @ApiResponse({
    status: 201,
    description: 'The theater has been successfully created.',
  })
  @Post()
  public createTheater(@Body() createTheaterDto: CreateTheaterDto) {
    return this.theatersService.create(createTheaterDto);
  }

  @ApiOperation({ summary: 'Update a theater' })
  @ApiResponse({
    status: 200,
    description: 'The theater has been successfully updated.',
  })
  @Patch()
  public updateTheater(@Body() patchTheaterDto: PatchTheaterDto) {
    return this.theatersService.update(patchTheaterDto);
  }

  @ApiOperation({ summary: 'Delete a theater' })
  @ApiResponse({
    status: 200,
    description: 'The theater has been successfully deleted.',
  })
  @Delete()
  public deleteTheater(@Query('id', ParseIntPipe) id: number) {
    return this.theatersService.delete(id);
  }
}
