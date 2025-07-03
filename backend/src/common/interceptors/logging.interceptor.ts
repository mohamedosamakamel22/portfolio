import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || '';
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: (data) => {
          const { statusCode } = response;
          const responseTime = Date.now() - startTime;
          const contentLength = response.get('content-length') || 0;
          
          this.logger.log(
            `${method} ${url} ${statusCode} ${responseTime}ms ${contentLength}b - ${ip} - ${userAgent}`
          );
        },
        error: (error) => {
          const { statusCode = 500 } = error;
          const responseTime = Date.now() - startTime;
          
          this.logger.error(
            `${method} ${url} ${statusCode} ${responseTime}ms - ${ip} - ${userAgent} - Error: ${error.message}`
          );
        },
      }),
    );
  }
} 