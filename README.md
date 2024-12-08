# ZEUS-CLI

ZEUS-CLI es una herramienta para generar proyectos base de microservicios en NestJS con una estructura de Arquitectura Limpia (Clean Architecture). 
Este CLI facilita la creación de proyectos con Nestjs, TypeORM y PostgreSQL, siguiendo las mejores prácticas de diseño y arquitectura.
Este CLI, debe generar proyectos y modulos y agregar nuestra marca: ZEUS-CLI, en todo los logs y console que emite el cli.
Este CLI, debe tener nuestro propio comando zeus-cli para poder generar proyectos respestando la estructura definida en la carpeta templates/src

## Estructura del Proyecto

La estructura generada por ZEUS-CLI sigue el patrón de Arquitectura Limpia, organizando el código en diferentes capas:

**************************
zeus-cli/
	commands/
		generateProject.js
		generateModule.js
	templates/
		src/
			application/        # Lógica de negocio (Casos de uso)
				use_cases/       # Implementación de casos de uso
				services/        # Servicios de negocio
				dtos/            # Data Transfer Objects (DTOs)
			domain/             # Lógica pura del dominio
				entities/        # Entidades del dominio
				repositories/    # Interfaces de repositorios
				value_objects/   # Objetos de valor (inmutables)
			infrastructure/     # Implementación de detalles técnicos
				persistence/     # Persistencia de datos (repositorios, migraciones, seeds)
					entities/     # Entidades de TypeORM (relación con la base de datos)
					migrations/   # Migraciones de base de datos
					seeds/        # Scripts de seed para datos iniciales
					repositories/ # Implementación de repositorios usando TypeORM
				services/        # Servicios técnicos (APIs externas, integraciones)
				config/          # Configuración de infraestructura (bases de datos, etc.)
				adapters/        # Adaptadores para integrar servicios externos
			presentation/       # Interfaces de usuario
				controllers/     # Controladores para gestionar solicitudes HTTP
				middleware/      # Middleware para manejo de solicitudes
				interceptors/    # Interceptores para modificar requests/responses
				filters/         # Filtros para manejo de excepciones
				pipes/           # Pipes para validaciones y transformaciones
				responses/       # Formato estándar para respuestas
			shared/             # Recursos compartidos
				utils/           # Funciones de utilidad generales
				constants/       # Constantes y configuraciones globales
					error-codes.template.ts # Códigos de error estándar
					messages.template.ts    # Mensajes comunes (e.g., validaciones)
					defaults.template.ts    # Valores por defecto
				exceptions/      # Clases de excepciones personalizadas
				event_bus/       # Comunicación asincrónica (eventos internos)
				logging/         # Servicios y configuraciones de logging
			tests/              # Pruebas unitarias, de integración y E2E
				unit/            # Pruebas unitarias
				integration/     # Pruebas de integración
				e2e/             # Pruebas end-to-end
			docs/               # Documentación técnica
				api/             # Documentación de endpoints (Swagger)
				architecture/    # Detalles de la arquitectura y decisiones técnicas
			main.template.ts    # Archivo de entrada principal (bootstrap del microservicio)
			app.module.template.ts # Módulo principal de NestJS
			config/             # Configuración global del sistema (variables de entorno, .env)
				env/
					.env.development     # Variables de entorno para desarrollo
					.env.production      # Variables de entorno para producción
					.env.test            # Variables de entorno para pruebas
				config.module.template.ts # Carga de variables de entorno usando @nestjs/config
				constants.template.ts    # Constantes globales del sistema, Nombres de servicios, rutas base de APIs.

**************************
Detalles y Propósitos de Cada Carpeta
------------------------------------------------------
application/:
Lógica del negocio central (casos de uso).
Servicios que orquestan las operaciones de negocio.
DTOs para transferir datos entre capas.

Ejemplo:
Un caso de uso como CreateOrder que valida datos, interactúa con repositorios, y orquesta otras operaciones de negocio.
------------------------------------------------------
domain/:
Regla de negocio pura:
Entidades: Representan los objetos principales del negocio.
Value Objects: Representan datos inmutables con validaciones específicas.
Repositorios: Definen interfaces para interactuar con persistencia.

Ejemplo:
Una entidad Order valida la cantidad mínima de productos y calcula el total.
------------------------------------------------------
infrastructure/:

Implementación técnica:
Repositorios de TypeORM.
Migraciones y seeds para inicializar datos en PostgreSQL.
Adaptadores para integrar servicios externos.
Ejemplo:

Repositorio OrderRepositoryImpl para guardar y recuperar datos de la base de datos.
------------------------------------------------------
presentation/:

Interfaces para interactuar con usuarios o sistemas externos:
Controladores que gestionan solicitudes HTTP.
Middleware, pipes, y filtros para transformar datos y manejar errores.
Respuestas estandarizadas para consumidores de la API.
Ejemplo:

Un controlador OrderController maneja la creación de órdenes y formatea la respuesta con un interceptor.
------------------------------------------------------
shared/:

Recursos compartidos entre diferentes módulos:
Servicios de logging para registrar eventos.
Clases de excepciones personalizadas para manejar errores de negocio.
Event bus para comunicación interna desacoplada.
Ejemplo:

Una excepción NotFoundException para manejar recursos no encontrados.
------------------------------------------------------
config/
Propósito:

Contiene configuraciones globales y generales del sistema.
Se utiliza para gestionar la carga de variables de entorno y configurar propiedades generales que pueden aplicarse a toda la aplicación.
Es independiente de cualquier tecnología o detalle de infraestructura.
Ejemplo de uso:

Archivos .env para diferentes entornos.
Configuración genérica que no está relacionada directamente con la infraestructura.
Configuración del sistema como:
Puerto del servidor.
Modo de ejecución (development, production).
Claves de API globales.
------------------------------------------------------
tests/:

Pruebas organizadas en:
Unitarias: Prueban funciones o clases aisladas.
Integración: Prueban la interacción entre componentes (e.g., repositorios y DB).
E2E: Pruebas completas desde la entrada hasta la salida del sistema.
------------------------------------------------------
docs/:

Documentación técnica para desarrolladores y consumidores.
Detalles de arquitectura, endpoints, y decisiones técnicas.

------------------------------------------------------

Soporte para Escenarios Adicionales
Comunicación entre microservicios:

Utiliza eventos asincrónicos en la carpeta shared/event_bus/ para publicar y consumir mensajes (RabbitMQ, Kafka, etc.).
Estandarización de Respuestas:

Implementa respuestas estándar en presentation/responses/ utilizando interceptores o middleware.
Configuración centralizada:

Centraliza todas las configuraciones en infrastructure/config/ y utiliza un paquete como @nestjs/config para cargar variables desde .env.
Seguridad:

Implementa middlewares de autenticación y autorización en presentation/middleware/.
Documentación de API:

Usa Swagger para generar documentación automática de los endpoints en docs/api/.
Monitoreo y Logs:

Configura un sistema de logging en shared/logging/ (Winston, Pino, etc.).
Integra herramientas como Prometheus y Grafana para monitorear métricas.
Manejo de Excepciones Globales:

Define filtros globales en presentation/filters/ para capturar y responder con errores estandarizados.


Las carpetas infrastructure/config/ y config/ tienen propósitos diferentes, aunque ambas están relacionadas con la configuración del sistema. Aquí te explico la diferencia y cómo podrías usarlas en tu proyecto:


¡Buena observación! Las carpetas infrastructure/config/ y config/ tienen propósitos diferentes, aunque ambas están relacionadas con la configuración del sistema. Aquí te explico la diferencia y cómo podrías usarlas en tu proyecto:

1. infrastructure/config/
Propósito:

Se utiliza para agrupar configuraciones relacionadas con la infraestructura y detalles técnicos del proyecto.
Incluye configuraciones específicas para tecnologías como bases de datos, ORM (TypeORM), APIs externas, autenticación, etc.
Ejemplo de uso:

Configuraciones que dependen de la implementación de la infraestructura.
Archivos o módulos relacionados con:
Configuración de TypeORM para la base de datos.
Configuración de servicios externos (APIs, proveedores de mensajería, etc.).
Configuración de integración con Redis, Kafka, RabbitMQ, etc.

Ejemplo de contenido:
infrastructure/config/
├── typeorm.config.ts      # Configuración de TypeORM
├── postgres.config.ts     # Configuración específica para PostgreSQL
├── redis.config.ts        # Configuración para Redis
├── kafka.config.ts        # Configuración para Kafka
└── mail.config.ts         # Configuración para servicio de correo
Ejemplo de un archivo typeorm.config.ts:
import { DataSourceOptions } from 'typeorm';

export const typeOrmConfig: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    entities: [__dirname + '/../persistence/entities/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../persistence/migrations/*{.ts,.js}'],
  };

2. config/
Propósito:

Contiene configuraciones globales y generales del sistema.
Se utiliza para gestionar la carga de variables de entorno y configurar propiedades generales que pueden aplicarse a toda la aplicación.
Es independiente de cualquier tecnología o detalle de infraestructura.
Ejemplo de uso:

Archivos .env para diferentes entornos.
Configuración genérica que no está relacionada directamente con la infraestructura.
Configuración del sistema como:
Puerto del servidor.
Modo de ejecución (development, production).
Claves de API globales.

config/
├── env/
│   ├── .env.development     # Variables de entorno para desarrollo
│   ├── .env.production      # Variables de entorno para producción
│   └── .env.test            # Variables de entorno para pruebas
├── config.module.ts         # Carga de variables de entorno usando @nestjs/config
└── constants.ts             # Constantes globales del sistema

Ejemplo de un archivo config.module.ts:
import { ConfigModule } from '@nestjs/config';

export const AppConfigModule = ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // Carga el archivo según el entorno
});

Ejemplo de un archivo constants.ts:
export const GLOBAL_CONSTANTS = {
    APP_NAME: 'My Microservice',
    DEFAULT_LANGUAGE: 'en',
    SUPPORTED_LANGUAGES: ['en', 'es'],
};

Resumen de Diferencias
Carpeta						Propósito												Ejemplo de Contenido
infrastructure/config/		Configuración específica de la infraestructura 		Configuración de TypeORM, PostgreSQL, APIs externas, Redis, Kafka, etc.
							y tecnologías utilizadas.	
config/						Configuración global y general del sistema.			Variables de entorno (.env), configuración del servidor, constantes globales.


Tecnologías y Librerías Sugeridas
NestJS: Framework principal para la estructura.
TypeORM: ORM para interactuar con PostgreSQL.
PostgreSQL: Base de datos relacional.
@nestjs/config: Para manejar configuraciones basadas en .env.
class-validator y class-transformer: Validación de DTOs.
Swagger: Para documentación de API.
Winston o Pino: Para logging.
Jest: Para pruebas unitarias y de integración.
Supertest: Para pruebas E2E.


Conclusión
Esta estructura está diseñada para cumplir con todos los requisitos necesarios para un microservicio moderno:

Soporta implementación modular y limpia.
Está optimizada para pruebas en diferentes niveles.
Facilita el despliegue en múltiples entornos con configuración clara y contenedores.
Incluye documentación técnica y de API.
Es escalable y fácil de mantener, con prácticas modernas como logging centralizado, manejo de errores, y métricas.






############################################

El archivo config.module.ts en la arquitectura de NestJS se utiliza para gestionar y cargar variables de entorno y configuraciones globales del sistema. Es una parte esencial cuando necesitas acceder a configuraciones dinámicas, como credenciales, URLs de servicios externos, o valores que dependen del entorno (desarrollo, producción, pruebas, etc.).

Propósito Principal de config.module.ts
Cargar Variables de Entorno:

Usa @nestjs/config para leer archivos .env o variables de entorno del sistema operativo.
Centralizar Configuraciones Globales:

Define valores que pueden ser utilizados en toda la aplicación, como claves de acceso, nombres de bases de datos o puertos del servidor.
Validar Configuraciones:

Garantiza que las variables de entorno requeridas están presentes y tienen el formato correcto (opcional, pero recomendado).
Proveer Configuración a Otros Módulos:

Expone variables de configuración como dependencias inyectables en servicios, controladores o cualquier parte de la aplicación.

Diferencia Entre constants.ts y config.module.ts
Aspecto								constants.ts				config.module.ts
Propósito	Contiene valores estáticos globales.	Maneja configuraciones dinámicas o 														específicas del entorno.
Ejemplo de Contenido	Límites de paginación, mensajes de error.	Credenciales de base de datos, URLs externas.
Fuentes de Configuración	Fijo, definido en el código fuente.	Dinámico, cargado desde variables de entorno (.env).
Reutilización	Se importa directamente donde se necesita.	Se usa como módulo inyectable en NestJS.
Ejemplo Completo de config.module.ts
Configuración del Módulo:
typescript
Copiar código
// config/config.module.ts
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

export const AppConfigModule = ConfigModule.forRoot({
    isGlobal: true, // Hace la configuración accesible en toda la aplicación
    envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // Carga el archivo .env según el entorno
    validationSchema: Joi.object({ // Validación de variables de entorno
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(5432),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        API_PORT: Joi.number().default(3000),
    }),
});
Archivo .env:
plaintext
Copiar código
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=secret
DB_NAME=my_database
API_PORT=3000
Acceso a Configuración Dinámica:
En un servicio o controlador, puedes usar ConfigService para acceder a las variables de entorno cargadas:

typescript
Copiar código
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService {
    constructor(private configService: ConfigService) {}

    getDatabaseConfig() {
        return {
            host: this.configService.get<string>('DB_HOST'),
            port: this.configService.get<number>('DB_PORT'),
            username: this.configService.get<string>('DB_USER'),
            password: this.configService.get<string>('DB_PASSWORD'),
            database: this.configService.get<string>('DB_NAME'),
        };
    }
}
Ventajas de config.module.ts
Flexibilidad:

Permite cambiar configuraciones sin modificar el código fuente, solo actualizando las variables de entorno.
Validación de Variables:

Garantiza que las variables requeridas estén presentes y sean correctas antes de que la aplicación se inicie.
Acceso Centralizado:

Usa ConfigService para acceder a cualquier variable de entorno desde cualquier módulo o servicio.
Compatibilidad con Entornos Múltiples:

Soporta configuraciones específicas para entornos (development, production, test).
Cuándo Usar config.module.ts y Cuándo constants.ts
Usa config.module.ts para:

Variables dinámicas basadas en el entorno (.env).
Configuraciones que pueden variar entre diferentes entornos.
Ejemplo: Credenciales, URLs externas, puertos.
Usa constants.ts para:

Valores estáticos que no cambian entre entornos.
Ejemplo: Límite de paginación, mensajes genéricos, códigos de error.
Conclusión
El archivo config.module.ts es crucial para gestionar configuraciones dinámicas y variables de entorno en NestJS. Complementa a constants.ts, que contiene valores estáticos y globales. Juntos, aseguran que tu aplicación sea flexible, mantenible y escalable.

¿Quieres un ejemplo más detallado de cómo integrarlos? 😊

############################################