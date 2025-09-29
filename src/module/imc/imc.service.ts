import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { CalcularImcDto } from './dto/calcular-imc-dto';
import { IImcRepository } from './IImcRepository';
import { CreateImcDto } from './dto/CreateImcDto';
import { ResponseImcHistoryDto } from './dto/response-imc-history.dto';

@Injectable()
export class ImcService {
  constructor(
    @Inject('IImcRepository')
    private readonly repository: IImcRepository,
  ) { }

  async calcularImc(
    data: CalcularImcDto,
    userId: string,
  ): Promise<{ imc: number; categoria: string }> {
    const { altura, peso } = data;
    // Validaciones explícitas para los tests
    if (peso <= 0 || peso >= 500) {
      throw new BadRequestException(
        'El peso debe ser mayor a 0 y menor a 500 kg',
      );
    }
    if (altura <= 0 || altura >= 3) {
      throw new BadRequestException(
        'La altura debe ser mayor a 0 y menor a 3 metros',
      );
    }

    const imc = peso / (altura * altura);
    const imcRedondeado = Math.round(imc * 100) / 100;

    let categoria: string;
    if (imc < 18.5) {
      categoria = 'Bajo peso';
    } else if (imc < 25) {
      categoria = 'Normal';
    } else if (imc < 30) {
      categoria = 'Sobrepeso';
    } else {
      categoria = 'Obeso';
    }

    const imcDto: CreateImcDto = {
      peso,
      altura,
      imc,
      imcRedondeado,
      categoria,
      userId,
    };

    await this.repository.create(imcDto);
    return { imc: imcRedondeado, categoria };
  }

  async findAll(
    userId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<ResponseImcHistoryDto[]> {
    const imcHistory = await this.repository.findAll(
      userId,
      startDate,
      endDate,
    );
    return imcHistory.map((imc) => ({
      id: imc.id,
      peso: imc.peso,
      altura: imc.altura,
      imc: imc.imc,
      imcRedondeado: imc.imcRedondeado,
      categoria: imc.categoria,
      fechahora: imc.fechahora,
    }));
  }

  async findAllAndStats(
    userId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<{
    items: ResponseImcHistoryDto[];
    stats: { total: number; promedioPeso: number; promedioImc: number, variacionPeso: number; variacionImc: number };
  }> {
    const imcHistory = await this.repository.findAll(userId, startDate, endDate);
    imcHistory.sort((a, b) => a.fechahora.getTime() - b.fechahora.getTime());

    const total = imcHistory.length;
    if (total === 0) {
      return { items: [], stats: { total: 0, promedioPeso: 0, promedioImc: 0, variacionPeso: 0, variacionImc: 0 } };
    }


    const pesos = imcHistory.map(item => item.peso).filter(peso => peso != null);
    const imcs = imcHistory.map(item => item.imc).filter(imc => imc != null);

    const sumaPesos = pesos.reduce((acc, n) => acc + n, 0);
    const promedioPeso = pesos.length ? sumaPesos / pesos.length : 0;
    const sumaImcs = imcs.reduce((acc, n) => acc + n, 0);
    const promedioImc = imcs.length ? sumaImcs / imcs.length : 0;

    let suma:number = 0;
    for (let index = 0; index < pesos.length; index++) {
      const element = Math.pow(pesos[index] - promedioPeso, 2);
      suma += element;
    }
    const variacionPeso = Math.sqrt(suma / pesos.length);

    let suma2:number = 0;
    for (let index = 0; index < imcs.length; index++) {
      const element = Math.pow(imcs[index] - promedioImc, 2);
      suma2 += element;
    }
    const variacionImc = Math.sqrt(suma2 / imcs.length);

    const items: ResponseImcHistoryDto[] = imcHistory.map(imc => ({
      id: imc.id,
      peso: imc.peso,
      altura: imc.altura,
      imc: imc.imc,
      imcRedondeado: imc.imcRedondeado,
      categoria: imc.categoria,
      fechahora: imc.fechahora,
    }));

    return { items, stats: { total, promedioPeso, promedioImc, variacionPeso, variacionImc } };
  }
}
