import { Module } from '@nestjs/common';
import { ImcService } from './imc.service';
import { ImcController } from './imc.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Imc } from './imc.entity';
import { ImcRepository } from './ImcRepository';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Imc]), HttpModule],
  controllers: [ImcController],
  providers: [
    ImcService,
    {
      provide: 'IImcRepository',
      useClass: ImcRepository,
    },
  ],
  exports: [TypeOrmModule, ImcService],
})
export class ImcModule {}
