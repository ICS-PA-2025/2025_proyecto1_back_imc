import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ImcService } from './imc.service';
import { CalcularImcDto } from './dto/calcular-imc-dto';
import { ResponseImcHistoryDto } from './dto/response-imc-history.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { UserId } from '../../common/decorators/user-id.decorator';

@Controller('imc')
@UseGuards(AuthGuard)
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
  calcular(
    @Body(ValidationPipe) data: CalcularImcDto,
    @UserId() userId: string,
  ) {
    console.log(data);
    return this.imcService.calcularImc(data, userId);
  }
}
