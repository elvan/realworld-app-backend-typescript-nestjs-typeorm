import { Module } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';

@Module({
  providers: [HttpExceptionFilter, TransformInterceptor],
  exports: [HttpExceptionFilter, TransformInterceptor],
})
export class SharedModule {}
