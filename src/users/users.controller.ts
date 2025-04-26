import { Body, Controller, Delete, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dtos/create-user.dto';
import { PatchUserDto } from './dtos/patch-user.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @Post()
  public createUser(
    @Body()
    createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto);
  }

  @Patch()
  public patchUser(@Body() patchUserDto: PatchUserDto) {
    return this.usersService.update(patchUserDto);
  }

  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  @Delete()
  public deleteUser(@Query('id', ParseIntPipe) id: number) {
    return this.usersService.delete(id);
  }
}
