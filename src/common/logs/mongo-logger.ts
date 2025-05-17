import { LoggerService } from '@nestjs/common';
import { LogsService } from './logs.service';

export class MongoLogger implements LoggerService {
  constructor(private readonly logsService: LogsService) {}

  async log(message: string, context?: string) {
    await this.logsService.log('log', message, context);
  }

  async error(message: string, trace?: string, context?: string) {
    await this.logsService.log('error', message, context, { trace });
  }

  async warn(message: string, context?: string) {
    await this.logsService.log('warn', message, context);
  }

  async debug?(message: string, context?: string) {
    await this.logsService.log('debug', message, context);
  }

  async verbose?(message: string, context?: string) {
    await this.logsService.log('verbose', message, context);
  }
}
