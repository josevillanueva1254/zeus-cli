import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const transactionId = uuidv4();
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((data) =>
        this.formatSuccessResponse(context, data, transactionId, request.method),
      ),
      catchError((error) =>
        this.formatErrorResponse(context, error, transactionId),
      ),
    );
  }

  /**
   * Formatea la respuesta de éxito.
   * @param context - Contexto de la solicitud.
   * @param data - Datos de la respuesta.
   * @param transactionId - ID único de la transacción.
   * @param method - Método HTTP (GET, POST, etc.).
   * @returns Respuesta formateada.
   */
  private formatSuccessResponse(
    context: ExecutionContext,
    data: any,
    transactionId: string,
    method: string,
  ): any {
    const statusCode = context.switchToHttp().getResponse().statusCode;
    const request = context.switchToHttp().getRequest();

    const responseData: any = {
      estado: {
        codigo: statusCode,
        mensaje: 'Operación exitosa.',
        transaccionId: transactionId,
      },
      datos: {
        resultado: data?.resultado || data,
      },
      errores: [],
    };

    // Solo agregar paginación si el método es GET
    if (method === 'GET') {
      const paginacion = request.query || {};
      responseData.datos.paginacion = {
        pagina: parseInt(paginacion.pagina) || 1,
        cantidad: parseInt(paginacion.cantidad) || 10,
        totalRegistros: data?.paginacion?.totalRegistros || 0,
      };
    }

    return responseData;
  }

  /**
   * Formatea la respuesta en caso de error.
   * @param context - Contexto de la solicitud.
   * @param error - Error capturado.
   * @param transactionId - ID único de la transacción.
   * @returns Respuesta formateada con los detalles del error.
   */
  private formatErrorResponse(
    context: ExecutionContext,
    error: any,
    transactionId: string,
  ): Observable<any> {
    const response = context.switchToHttp().getResponse();
    const statusCode =
      error instanceof HttpException
        ? error.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      error instanceof HttpException
        ? error.getResponse()
        : { message: 'Se produjo un error inesperado.' };

    const formattedErrors = Array.isArray(message['message'])
      ? message['message'].map((m) => ({
          codigo: m.code || 'VALIDATION_ERROR',
          mensaje: m.message || m,
          detalles: m.detalles || {},
        }))
      : [
          {
            codigo: error.code || 'ERROR_INTERNO',
            mensaje: message['message'] || 'Error inesperado',
            detalles: error.stack ? { stack: error.stack } : {},
          },
        ];

    const errorResponse = {
      estado: {
        codigo: statusCode,
        mensaje: message['message'] || 'Error inesperado',
        transaccionId: transactionId,
      },
      datos: {
        resultado: null,
      },
      errores: formattedErrors,
    };

    return response.status(statusCode).json(errorResponse);
  }
}
