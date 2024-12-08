import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HelloController } from './presentation/controllers/hello.controller';
import { GetHelloUseCase } from './application/use-cases/get-hello.use-case';
import { PaginationInterceptor } from './presentation/middleware/pagination.interceptor';

@Module({
  controllers: [HelloController],
  providers: [
    GetHelloUseCase,
    {
      provide: APP_INTERCEPTOR,
      useClass: PaginationInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // ...existing code...
  }
}
