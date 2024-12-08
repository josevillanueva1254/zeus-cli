import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CONSTANTS } from '../../config/constants';

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // Aplicar solo a métodos GET
    if (request.method === 'GET') {
      const { pagina, cantRegistro } = request.query;

      // Utilizar operadores de coalescencia nula para valores por defecto
      const page = this.parseToInt(pagina, CONSTANTS.PAGINATION.DEFAULT_PAGE);
      const limit = this.parseToInt(cantRegistro, CONSTANTS.PAGINATION.DEFAULT_LIMIT);

      // Agregar el objeto de paginación a la solicitud
      request.pagination = { page, limit };
    }

    return next.handle();
  }

  /**
   * Convierte un valor a entero, o devuelve un valor por defecto si es inválido.
   * @param value El valor a convertir.
   * @param defaultValue El valor por defecto si la conversión falla.
   * @returns Un número entero.
   */
  private parseToInt(value: any, defaultValue: number): number {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }
}
