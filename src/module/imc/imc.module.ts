import { Module } from '@nestjs/common';
import { ImcService } from './imc.service';
import { ImcController } from './imc.controller';
import { ImcRepository } from './ImcRepository';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Imc, ImcSchema } from './imc.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Imc.name, schema: ImcSchema }]),
    HttpModule,
  ],
  controllers: [ImcController],
  providers: [
    ImcService,
    {
      provide: 'IImcRepository',
      useClass: ImcRepository,
    },
  ],
  exports: [ImcService],
})
export class ImcModule {}
