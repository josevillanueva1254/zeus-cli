import { DataSource } from 'typeorm';

const isProduction = process.env.NODE_ENV === 'production';

export const typeOrmConfig = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: !isProduction, // sincronización solo en desarrollo
  logging: !isProduction, // logging solo en desarrollo
  entities: [__dirname + '/../persistence/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../persistence/migrations/*{.ts,.js}'],
  migrationsRun: isProduction, // ejecutar migraciones automáticamente en producción
});
