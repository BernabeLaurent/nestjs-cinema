import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, map } from 'rxjs';

@Injectable()
export class DataResponseInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: data,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        apiVersion: this.configService.get('appConfig.apiVersion'),
      })),
    );
  }
}
