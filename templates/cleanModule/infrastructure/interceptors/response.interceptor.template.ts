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
  
      return next.handle().pipe(
        map((data) => ({
          estado: {
            codigo: context.switchToHttp().getResponse().statusCode,
            mensaje: 'Operación exitosa.',
            transaccionId: transactionId,
          },
          datos: {
            paginacion: data?.paginacion || null,
            resultado: data?.resultado || data,
          },
          errores: [],
        })),
        catchError((error) => {
          const response = context.switchToHttp().getResponse();
          const statusCode =
            error instanceof HttpException
              ? error.getStatus()
              : HttpStatus.INTERNAL_SERVER_ERROR;
  
          const message =
            error instanceof HttpException
              ? error.getResponse()
              : { message: 'Se produjo un error inesperado.' };
  
          return response.status(statusCode).json({
            estado: {
              codigo: statusCode,
              mensaje: message['message'] || 'Error inesperado',
              transaccionId: transactionId,
            },
            datos: {
              paginacion: null,
              resultado: null,
            },
            errores: Array.isArray(message['message'])
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
                ],
          });
        }),
      );
    }
  }
  