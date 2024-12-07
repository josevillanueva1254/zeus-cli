# ZEUS-CLI

ZEUS-CLI es una herramienta para generar proyectos base en NestJS con una estructura de Arquitectura Limpia (Clean Architecture). Este CLI facilita la creación de proyectos con TypeORM y PostgreSQL, siguiendo las mejores prácticas de diseño y arquitectura.

## Estructura del Proyecto

La estructura generada por ZEUS-CLI sigue el patrón de Arquitectura Limpia, organizando el código en diferentes capas:

zeus-cli/
├── commands/
│   ├── generateProject.js
│   ├── generateModule.js
├── templates/
│   ├── cleanModule/
        ├── app.module.template.ts
        ├── main.template.ts
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── entity.template.ts
│   │   │   ├── repositories/
│   │   │   │   └── repository.template.ts
│   │   ├── application/
│   │   │   └── use-cases/
│   │   │       └── use-case.template.ts
│   │   ├── infrastructure/
│   │   │   ├── interceptors/
│   │   │   │   └── response.interceptor.template.ts
│   │   │   ├── controllers/
│   │   │   │   └── controller.template.ts
│   │   │   ├── repositories/
│   │   │   │   └── repository-impl.template.ts
│   │   │   ├── database/
│   │   │   │   └── orm-entity.template.ts
│   │   ├── presentation/
│   │       ├── dtos/
│   │       │   └── dto.template.ts
│   │       └── http/
│   │           └── controller.template.ts
├── index.js
├── package.json

## Comandos

### Generar Proyecto

Para generar un nuevo proyecto base con NestJS y Arquitectura Limpia, utiliza el siguiente comando:

./zeus module <nombre>
