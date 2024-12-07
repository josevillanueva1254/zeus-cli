import { Controller, Get } from '@nestjs/common';
import { GetHelloUseCase } from '../../application/use-cases/get-hello.use-case';

@Controller('hello')
export class HelloController {
  constructor(private readonly getHelloUseCase: GetHelloUseCase) {}

  @Get()
  getHello(): string {
    return this.getHelloUseCase.execute();
  }
}
