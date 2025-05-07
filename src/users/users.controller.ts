import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { AuthType } from '../auth/enums/auth-type.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleUser } from './enums/roles-users.enum';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Créer un utilisateur' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user has been successfully created.',
  })
  @Post()
  @Auth(AuthType.Bearer)
  @Roles([RoleUser.ADMIN])
  public create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Récupérer tous les utilisateurs' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all users.',
  })
  @Get()
  @Auth(AuthType.Bearer)
  @Roles([RoleUser.ADMIN])
  public findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Récupérer un utilisateur' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the user.',
  })
  @Get(':id')
  @Auth(AuthType.Bearer)
  public findOne(@Param('id') id: number) {
    return this.usersService.findOneById(id);
  }

  @ApiOperation({ summary: 'Mettre à jour un utilisateur' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully updated.',
  })
  @Patch(':id')
  @Auth(AuthType.Bearer)
  public update(@Param('id') id: number, @Body() patchUserDto: PatchUserDto) {
    return this.usersService.update(id, patchUserDto);
  }

  @ApiOperation({ summary: 'Supprimer un utilisateur' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully deleted.',
  })
  @Delete(':id')
  @Auth(AuthType.Bearer)
  @Roles([RoleUser.ADMIN])
  public remove(@Param('id') id: number) {
    return this.usersService.delete(id);
  }
}
