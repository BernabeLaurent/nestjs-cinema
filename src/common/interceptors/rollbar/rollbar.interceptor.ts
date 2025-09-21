import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as Rollbar from 'rollbar';
import rollbarConfig from '../../../config/rollbar.config';
import { Level } from 'rollbar';
import { Request } from 'express';

/**
 * Interface pour la requête authentifiée
 */
interface AuthenticatedRequest extends Request {
  user?: {
    sub: string;
    email: string;
    role: string;
  };
}

/**
 * Intercepteur global pour capturer et reporter les erreurs via Rollbar
 */
@Injectable()
export class RollbarInterceptor implements NestInterceptor {
  private readonly rollbar?: Rollbar;

  constructor(
    @Inject(rollbarConfig.KEY)
    private readonly rollbarConfiguration: ConfigType<typeof rollbarConfig>,
  ) {
    if (this.rollbarConfiguration.enabled) {
      this.rollbar = new Rollbar({
        accessToken: this.rollbarConfiguration.accessToken,
        environment: this.rollbarConfiguration.environment,
        codeVersion: this.rollbarConfiguration.codeVersion,
        captureUncaught: this.rollbarConfiguration.captureUncaught,
        captureUnhandledRejections:
        this.rollbarConfiguration.captureUnhandledRejections,
        reportLevel: this.rollbarConfiguration.reportLevel as Level,
        ignoredMessages: this.rollbarConfiguration.ignoredMessages,
      });
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error: unknown) => {
        if (this.rollbar && this.rollbarConfiguration.enabled) {
          const request = context
            .switchToHttp()
            .getRequest<AuthenticatedRequest>();

          const user = request.user ?? null;

          // Enrichir l'erreur avec le contexte de la requête
          this.rollbar.error(error as Error, {
            request: {
              url: request.url,
              method: request.method,
              headers: this.sanitizeHeaders(request.headers),
              query: request.query,
              body: this.sanitizeBody(request.body),
            },
            user: user
              ? {
                id: user.sub,
                email: user.email,
                role: user.role,
              }
              : null,
            timestamp: new Date().toISOString(),
          });
        }

        return throwError(() => error);
      }),
    );
  }

  /**
   * Nettoie les headers sensibles avant envoi à Rollbar
   */
  private sanitizeHeaders(
    headers: Record<string, string | undefined>,
  ): Record<string, string | undefined> {
    const sanitized: Record<string, string | undefined> = { ...headers };
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];

    sensitiveHeaders.forEach((header) => {
      if (header in sanitized && sanitized[header]) {
        sanitized[header] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  /**
   * Nettoie les données sensibles du body avant envoi à Rollbar
   */
  private sanitizeBody(body: unknown): unknown {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sanitized = { ...(body as Record<string, unknown>) };
    const sensitiveFields = ['password', 'token', 'secret', 'key'];

    sensitiveFields.forEach((field) => {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }
}
