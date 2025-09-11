import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { ImcService } from './imc.service';
import { CalcularImcDto } from './dto/calcular-imc-dto';
import { ResponseImcHistoryDto } from './dto/response-imc-history.dto';

@Controller('imc')
export class ImcController {
  constructor(private readonly imcService: ImcService) {}

  @Get()
  async findAll(): Promise<ResponseImcHistoryDto[]> {
    return await this.imcService.findAll();
  }

  @Post('calcular')
  calcular(@Body(ValidationPipe) data: CalcularImcDto) {
    return this.imcService.calcularImc(data);
  }
}
