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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { AuthType } from '../auth/enums/auth-type.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleUser } from './enums/roles-users.enum';

/**
 * Contrôleur responsable de la gestion des utilisateurs
 * Gère l'inscription, la modification et la consultation des profils utilisateurs
 * Inclut la gestion des rôles et des permissions
 */
@Controller('users')
@ApiTags('Utilisateurs')
@Auth(AuthType.Bearer)
@ApiBearerAuth('access-token')
export class UsersController {
  /**
   * Constructeur du contrôleur des utilisateurs
   * @param usersService Service de gestion des utilisateurs injecté
   */
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Créer un nouvel utilisateur',
    description: 'Inscription d\'un nouvel utilisateur dans le système (accessible sans authentification)'
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'L\'utilisateur a été créé avec succès',
  })
  @Post()
  @Auth(AuthType.None)
  public create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({
    summary: 'Récupérer tous les utilisateurs',
    description: 'Obtient la liste complète des utilisateurs (réservé aux administrateurs)'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Liste des utilisateurs retournée avec succès',
  })
  @Get()
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
  public findOne(@Param('id') id: number) {
    return this.usersService.findOneById(id);
  }

  @ApiOperation({ summary: 'Mettre à jour un utilisateur' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully updated.',
  })
  @Patch(':id')
  public update(@Param('id') id: number, @Body() patchUserDto: PatchUserDto) {
    return this.usersService.update(id, patchUserDto);
  }

  @ApiOperation({ summary: 'Supprimer un utilisateur' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully deleted.',
  })
  @Delete(':id')
  @Roles([RoleUser.ADMIN])
  public remove(@Param('id') id: number) {
    return this.usersService.delete(id);
  }

  @ApiOperation({ summary: 'Vérifier si un email est disponible' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Check if email is available.',
  })
  @Get('check-email/:email')
  @Auth(AuthType.None)
  public async checkEmail(@Param('email') email: string) {
    try {
      await this.usersService.findOneByEmail(email);
      return { available: false };
    } catch {
      return { available: true };
    }
  }
}
