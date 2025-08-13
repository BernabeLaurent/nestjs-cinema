import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, map } from 'rxjs';
import { Response } from 'express';

interface DataResponse<T = unknown> {
  data: T;
  apiVersion: string | undefined;
}

@Injectable()
export class DataResponseInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data: unknown): unknown => {
        // Ne pas transformer les réponses d'erreur (status >= 400)
        if (response && response.statusCode >= 400) {
          return data;
        }

        const result: DataResponse<unknown> = {
          data: data,
          apiVersion: this.configService.get('appConfig.apiVersion'),
        };

        return result;
      }),
    );
  }
}
