import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

export const mongooseAsyncConfig: MongooseModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    // Obtener variables de entorno
    const mongoUri = config.get<string>('MONGO_URI');
    const mongoHost = config.get<string>('MONGO_HOST', 'localhost');
    const mongoPort = config.get<number>('MONGO_PORT', 27017);
    const mongoDatabase = config.get<string>('MONGO_DATABASE', 'imc_db');

    // Construir URI si no existe una completa
    const uri = mongoUri || `mongodb://${mongoHost}:${mongoPort}/${mongoDatabase}`;

    return { uri };
  },
};
