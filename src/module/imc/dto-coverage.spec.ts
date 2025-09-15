import { CreateImcDto } from './dto/CreateImcDto';
import { ResponseImcHistoryDto } from './dto/response-imc-history.dto';
import { CalcularImcDto } from './dto/calcular-imc-dto';

describe('DTO coverage', () => {
  it('should create a CreateImcDto instance', () => {
    const dto = new CreateImcDto();
    dto.peso = 70;
    dto.altura = 1.75;
    dto.imc = 22.86;
    dto.imcRedondeado = 22.86;
    dto.categoria = 'Normal';
    expect(dto).toBeInstanceOf(CreateImcDto);
    expect(dto.peso).toBe(70);
    expect(dto.categoria).toBe('Normal');
  });

  it('should create a ResponseImcHistoryDto instance', () => {
    const dto = new ResponseImcHistoryDto();
    dto.id = 1;
    dto.peso = 70;
    dto.altura = 1.75;
    dto.imc = 22.86;
    dto.imcRedondeado = 22.86;
    dto.categoria = 'Normal';
    dto.fechahora = new Date('2025-09-12T10:00:00Z');
    expect(dto).toBeInstanceOf(ResponseImcHistoryDto);
    expect(dto.id).toBe(1);
    expect(dto.fechahora).toBeInstanceOf(Date);
  });

  it('should create a CalcularImcDto instance', () => {
    const dto = new CalcularImcDto();
    dto.peso = 70;
    dto.altura = 1.75;
    expect(dto).toBeInstanceOf(CalcularImcDto);
    expect(dto.peso).toBe(70);
    expect(dto.altura).toBe(1.75);
  });
});
