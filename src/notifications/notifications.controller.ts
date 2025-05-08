import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SendEmailDto } from './dtos/send-email.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { AuthType } from '../auth/enums/auth-type.enum';

@Controller('notifications')
@Auth(AuthType.Bearer)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send-email')
  @ApiOperation({ summary: "Permet d'envoyer un email" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email sent successfully',
  })
  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    return this.notificationsService.sendEmail(
      sendEmailDto.userId,
      sendEmailDto.email,
      sendEmailDto.subject,
      sendEmailDto.text,
    );
  }
}
