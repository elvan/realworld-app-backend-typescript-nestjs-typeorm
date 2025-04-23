import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // The response data is already structured according to the RealWorld API spec
    // This interceptor is mainly for logging and potential future transformations
    return next.handle().pipe(
      map(data => {
        return data;
      }),
    );
  }
}
