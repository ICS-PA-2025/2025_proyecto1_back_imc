import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ImcService } from './imc.service';
import { CalcularImcDto } from './dto/calcular-imc-dto';
import { ResponseImcHistoryDto } from './dto/response-imc-history.dto';

@Controller('imc')
export class ImcController {
  constructor(private readonly imcService: ImcService) {}

  @Get()
  async findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<ResponseImcHistoryDto[]> {
    return await this.imcService.findAll(startDate, endDate);
  }

  @Post('calcular')
  calcular(@Body(ValidationPipe) data: CalcularImcDto) {
    return this.imcService.calcularImc(data);
  }
}
