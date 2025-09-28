import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

export const mongooseAsyncConfig: MongooseModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    uri:
      config.get<string>('MONGO_URI') ||
      `mongodb://${config.get<string>('MONGO_HOST', 'localhost')}:${config.get<number>('MONGO_PORT', 27017)}/${config.get<string>('MONGO_DATABASE', 'imc_db')}`,
  }),
};
