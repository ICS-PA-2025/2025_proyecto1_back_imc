import { Inject, Injectable } from '@nestjs/common';
import { CalcularImcDto } from './dto/calcular-imc-dto';
import { IImcRepository } from './IImcRepository';
import { CreateImcDto } from './dto/CreateImcDto';

@Injectable()
export class ImcService {
  constructor(
    @Inject('IImcRepository')
    private readonly repository: IImcRepository,
  ) {}

  calcularImc(data: CalcularImcDto): { imc: number; categoria: string } {
    const { altura, peso } = data;
    const imc = peso / (altura * altura);
    const imcRedondeado = Math.round(imc * 100) / 100; // Dos decimales

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
    };

    this.repository.create(imcDto);

    return { imc: imcRedondeado, categoria };
  }
}
