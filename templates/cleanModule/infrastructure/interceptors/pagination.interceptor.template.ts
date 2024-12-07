import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { DEFAULT_PAGE, DEFAULT_RECORDS } from '../../../cleanModule/config/constants';

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    if (request.method === 'GET') {
      let { pagina = DEFAULT_PAGE, cantRegistro = DEFAULT_RECORDS } = request.query;
      pagina = pagina ? parseInt(pagina, 10) : DEFAULT_PAGE;
      cantRegistro = cantRegistro ? parseInt(cantRegistro, 10) : DEFAULT_RECORDS;
      request.pagination = {
        pagina,
        cantRegistro,
      };
    }
    return next.handle();
  }
}