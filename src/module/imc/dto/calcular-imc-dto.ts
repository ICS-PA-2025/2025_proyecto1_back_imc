import { IsNumber, Max, Min } from 'class-validator';

export class CalcularImcDto {
  @IsNumber()
  @Min(0.1, { message: 'La altura debe ser mayor a 0.1 metros' }) // Altura mínima razonable
  @Max(3, { message: 'La altura debe ser menor a 3 metros' }) // Altura máxima razonable
  altura: number;

  @IsNumber()
  @Min(0.1, { message: 'El peso debe ser mayor a 0.1 kilogramos' }) // Peso mínimo razonable
  @Max(500, { message: 'El peso debe ser menor a 500 kilogramos' }) // Peso máximo razonable
  peso: number;
}
  