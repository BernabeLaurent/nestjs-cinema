import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTheaterDto } from './dtos/create-theater.dto';
import { TheatersService } from './theaters.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PatchTheaterDto } from './dtos/patch-theater.dto';
import { GetTheaterDto } from './dtos/get-theater.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { AuthType } from '../auth/enums/auth-type.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleUser } from '../users/enums/roles-users.enum';

@Controller('theaters')
@ApiTags('Theaters')
@Auth(AuthType.Bearer)
@ApiBearerAuth('access-token') // La route attend un Bearer token
export class TheatersController {
  constructor(private readonly theatersService: TheatersService) {}

  @Get('{/:id}')
  @ApiOperation({ summary: 'Get Theater by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User found successfully',
  })
  @Auth(AuthType.None)
  public getTheater(@Param() getTheaterDto: GetTheaterDto) {
    return this.theatersService.findOneById(getTheaterDto.id);
  }

  @ApiOperation({ summary: 'Create a new theater' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The theater has been successfully created.',
  })
  @Roles([RoleUser.ADMIN])
  @Post()
  public createTheater(@Body() createTheaterDto: CreateTheaterDto) {
    return this.theatersService.create(createTheaterDto);
  }

  @ApiOperation({ summary: 'Update a theater' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The theater has been successfully updated.',
  })
  @Patch(':id')
  @Roles([RoleUser.ADMIN])
  public updateTheater(
    @Param('id', ParseIntPipe) id: number,
    @Body() patchTheaterDto: PatchTheaterDto,
  ) {
    return this.theatersService.update(id, patchTheaterDto);
  }

  @ApiOperation({ summary: 'Delete a theater' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The theater has been successfully deleted.',
  })
  @Delete()
  @Roles([RoleUser.ADMIN])
  public deleteTheater(@Query('id', ParseIntPipe) id: number) {
    return this.theatersService.delete(id);
  }
}
