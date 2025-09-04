import { Module } from '@nestjs/common';
import { ImcService } from './imc.service';
import { ImcController } from './imc.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Imc } from './imc.entity';
import { ImcRepository } from './ImcRepository';

@Module({
  imports: [TypeOrmModule.forFeature([Imc])],
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
