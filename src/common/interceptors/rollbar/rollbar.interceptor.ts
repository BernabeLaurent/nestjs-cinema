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
import { IncomingHttpHeaders } from 'node:http';

/**
 * Interface pour la requête authentifiée
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
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
  private sanitizeHeaders(headers: IncomingHttpHeaders): {
    [p: string]: string | string[] | undefined;
    accept?: string | undefined;
    'accept-encoding'?: string | undefined;
    'accept-language'?: string | undefined;
    'accept-patch'?: string | undefined;
    'accept-ranges'?: string | undefined;
    'access-control-allow-credentials'?: string | undefined;
    'access-control-allow-headers'?: string | undefined;
    'access-control-allow-methods'?: string | undefined;
    'access-control-allow-origin'?: string | undefined;
    'access-control-expose-headers'?: string | undefined;
    'access-control-max-age'?: string | undefined;
    'access-control-request-headers'?: string | undefined;
    'access-control-request-method'?: string | undefined;
    age?: string | undefined;
    allow?: string | undefined;
    'alt-svc'?: string | undefined;
    authorization?: string | undefined;
    'cache-control'?: string | undefined;
    connection?: string | undefined;
    'content-disposition'?: string | undefined;
    'content-encoding'?: string | undefined;
    'content-language'?: string | undefined;
    'content-length'?: string | undefined;
    'content-location'?: string | undefined;
    'content-range'?: string | undefined;
    'content-type'?: string | undefined;
    cookie?: string | undefined;
    date?: string | undefined;
    etag?: string | undefined;
    expect?: string | undefined;
    expires?: string | undefined;
    forwarded?: string | undefined;
    from?: string | undefined;
    host?: string | undefined;
    'if-match'?: string | undefined;
    'if-modified-since'?: string | undefined;
    'if-none-match'?: string | undefined;
    'if-unmodified-since'?: string | undefined;
    'last-modified'?: string | undefined;
    location?: string | undefined;
    origin?: string | undefined;
    pragma?: string | undefined;
    'proxy-authenticate'?: string | undefined;
    'proxy-authorization'?: string | undefined;
    'public-key-pins'?: string | undefined;
    range?: string | undefined;
    referer?: string | undefined;
    'retry-after'?: string | undefined;
    'sec-fetch-site'?: string | undefined;
    'sec-fetch-mode'?: string | undefined;
    'sec-fetch-user'?: string | undefined;
    'sec-fetch-dest'?: string | undefined;
    'sec-websocket-accept'?: string | undefined;
    'sec-websocket-extensions'?: string | undefined;
    'sec-websocket-key'?: string | undefined;
    'sec-websocket-protocol'?: string | undefined;
    'sec-websocket-version'?: string | undefined;
    'set-cookie'?: string[] | undefined;
    'strict-transport-security'?: string | undefined;
    tk?: string | undefined;
    trailer?: string | undefined;
    'transfer-encoding'?: string | undefined;
    upgrade?: string | undefined;
    'user-agent'?: string | undefined;
    vary?: string | undefined;
    via?: string | undefined;
    warning?: string | undefined;
    'www-authenticate'?: string | undefined;
  } {
    const sanitized: {
      [p: string]: string | string[] | undefined;
      accept?: string | undefined;
      'accept-encoding'?: string | undefined;
      'accept-language'?: string | undefined;
      'accept-patch'?: string | undefined;
      'accept-ranges'?: string | undefined;
      'access-control-allow-credentials'?: string | undefined;
      'access-control-allow-headers'?: string | undefined;
      'access-control-allow-methods'?: string | undefined;
      'access-control-allow-origin'?: string | undefined;
      'access-control-expose-headers'?: string | undefined;
      'access-control-max-age'?: string | undefined;
      'access-control-request-headers'?: string | undefined;
      'access-control-request-method'?: string | undefined;
      age?: string | undefined;
      allow?: string | undefined;
      'alt-svc'?: string | undefined;
      authorization?: string | undefined;
      'cache-control'?: string | undefined;
      connection?: string | undefined;
      'content-disposition'?: string | undefined;
      'content-encoding'?: string | undefined;
      'content-language'?: string | undefined;
      'content-length'?: string | undefined;
      'content-location'?: string | undefined;
      'content-range'?: string | undefined;
      'content-type'?: string | undefined;
      cookie?: string | undefined;
      date?: string | undefined;
      etag?: string | undefined;
      expect?: string | undefined;
      expires?: string | undefined;
      forwarded?: string | undefined;
      from?: string | undefined;
      host?: string | undefined;
      'if-match'?: string | undefined;
      'if-modified-since'?: string | undefined;
      'if-none-match'?: string | undefined;
      'if-unmodified-since'?: string | undefined;
      'last-modified'?: string | undefined;
      location?: string | undefined;
      origin?: string | undefined;
      pragma?: string | undefined;
      'proxy-authenticate'?: string | undefined;
      'proxy-authorization'?: string | undefined;
      'public-key-pins'?: string | undefined;
      range?: string | undefined;
      referer?: string | undefined;
      'retry-after'?: string | undefined;
      'sec-fetch-site'?: string | undefined;
      'sec-fetch-mode'?: string | undefined;
      'sec-fetch-user'?: string | undefined;
      'sec-fetch-dest'?: string | undefined;
      'sec-websocket-accept'?: string | undefined;
      'sec-websocket-extensions'?: string | undefined;
      'sec-websocket-key'?: string | undefined;
      'sec-websocket-protocol'?: string | undefined;
      'sec-websocket-version'?: string | undefined;
      'set-cookie'?: string[] | undefined;
      'strict-transport-security'?: string | undefined;
      tk?: string | undefined;
      trailer?: string | undefined;
      'transfer-encoding'?: string | undefined;
      upgrade?: string | undefined;
      'user-agent'?: string | undefined;
      vary?: string | undefined;
      via?: string | undefined;
      warning?: string | undefined;
      'www-authenticate'?: string | undefined;
    } = { ...headers };
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
