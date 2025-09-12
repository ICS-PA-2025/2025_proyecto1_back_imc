import { BadRequestException, Injectable } from "@nestjs/common";
import { CalcularImcDto } from "./dto/calcular-imc-dto";


@Injectable()
export class ImcService {
  calcularImc(data: CalcularImcDto): { imc: number; categoria: string } {
    
    const { altura, peso } = data;
    if (peso <= 0 || peso >= 500) {
      throw new BadRequestException("El peso debe ser mayor a 0 y menor a 500 kg");
    }
    if (altura <= 0 || altura >= 3) {
      throw new BadRequestException("La altura debe ser mayor a 0 y menor a 3 metros");
    }
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
    console.log({ altura, peso, imc });

    return { imc: imcRedondeado, categoria };
  }
}

