import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  // Prioriza DATABASE_URL, si no existe, construye la URL manualmente
  let databaseUrl = configService.get<string>('DATABASE_URL');

  if (!databaseUrl) {
    const host = configService.get<string>('DATABASE_HOST');
    const port = configService.get<string>('DATABASE_PORT');
    const username = configService.get<string>('DATABASE_USERNAME');
    const password = configService.get<string>('DATABASE_PASSWORD');
    const dbName = configService.get<string>('DATABASE_NAME');
    if (host && port && username && password && dbName) {
      databaseUrl = `postgres://${username}:${password}@${host}:${port}/${dbName}`;
    } else {
      throw new Error(
        'No se encontró DATABASE_URL ni todas las variables separadas para la conexión a la base de datos.',
      );
    }
  }

  return {
    type: 'postgres',
    url: databaseUrl,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: configService.get<string>('NODE_ENV') === 'development', // SOLO en dev
    logging: configService.get<string>('NODE_ENV') === 'development',
    ssl: {
      rejectUnauthorized: false,
    },
  };
};
