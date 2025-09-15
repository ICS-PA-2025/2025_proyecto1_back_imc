import { Test, TestingModule } from '@nestjs/testing';
import { ImcService } from './imc.service';
import { CalcularImcDto } from './dto/calcular-imc-dto';
import { BadRequestException } from '@nestjs/common';


describe('ImcService', () => {
  let service: ImcService;
  let mockImcRepository: any;

  beforeEach(async () => {
    mockImcRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImcService,
        {
          provide: 'IImcRepository',
          useValue: mockImcRepository,
        },
      ],
    }).compile();

    service = module.get<ImcService>(ImcService);
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('calcularImc', () => {
    // Casos válidos
    it('debería calcular un IMC normal', () => {
      const dto: CalcularImcDto = { altura: 1.75, peso: 70 };
      const result = service.calcularImc(dto);
      expect(result.imc).toBeCloseTo(22.86, 2);
      expect(result.categoria).toBe('Normal');
    });

    it('debería retornar "Bajo peso" si IMC < 18.5', () => {
      const dto: CalcularImcDto = { altura: 1.75, peso: 50 };
      const result = service.calcularImc(dto);
      expect(result.imc).toBeCloseTo(16.33, 2);
      expect(result.categoria).toBe('Bajo peso');
    });

    it('debería retornar "Sobrepeso" si 25 <= IMC < 30', () => {
      const dto: CalcularImcDto = { altura: 1.75, peso: 80 };
      const result = service.calcularImc(dto);
      expect(result.imc).toBeCloseTo(26.12, 2);
      expect(result.categoria).toBe('Sobrepeso');
    });

    it('debería retornar "Obeso" si IMC >= 30', () => {
      const dto: CalcularImcDto = { altura: 1.75, peso: 100 };
      const result = service.calcularImc(dto);
      expect(result.imc).toBeCloseTo(32.65, 2);
      expect(result.categoria).toBe('Obeso');
    });

    // Casos inválidos (validaciones)
    it('debería lanzar error si el peso es <= 0', () => {
      const dto: CalcularImcDto = { altura: 1.70, peso: 0 };
      expect(() => service.calcularImc(dto)).toThrow(
        new BadRequestException('El peso debe ser mayor a 0 y menor a 500 kg'),
      );
    });

    it('debería lanzar error si el peso es >= 500', () => {
      const dto: CalcularImcDto = { altura: 1.70, peso: 500 };
      expect(() => service.calcularImc(dto)).toThrow(
        new BadRequestException('El peso debe ser mayor a 0 y menor a 500 kg'),
      );
    });

    it('debería lanzar error si la altura es <= 0', () => {
      const dto: CalcularImcDto = { altura: 0, peso: 70 };
      expect(() => service.calcularImc(dto)).toThrow(
        new BadRequestException('La altura debe ser mayor a 0 y menor a 3 metros'),
      );
    });

    it('debería lanzar error si la altura es >= 3', () => {
      const dto: CalcularImcDto = { altura: 3, peso: 70 };
      expect(() => service.calcularImc(dto)).toThrow(
        new BadRequestException('La altura debe ser mayor a 0 y menor a 3 metros'),
      );
    });
  });

  describe('findAll', () => {
    it('debería retornar el historial de IMC mapeado correctamente', async () => {
      const mockImcList = [
        {
          id: 1,
          peso: 70,
          altura: 1.75,
          imc: 22.86,
          imcRedondeado: 22.86,
          categoria: 'Normal',
          fechahora: new Date('2025-09-12T10:00:00Z'),
        },
        {
          id: 2,
          peso: 80,
          altura: 1.8,
          imc: 24.69,
          imcRedondeado: 24.69,
          categoria: 'Normal',
          fechahora: new Date('2025-09-11T10:00:00Z'),
        },
      ];
      mockImcRepository.findAll.mockResolvedValue(mockImcList);

      const result = await service.findAll();
      expect(result).toEqual([
        {
          id: 1,
          peso: 70,
          altura: 1.75,
          imc: 22.86,
          imcRedondeado: 22.86,
          categoria: 'Normal',
          fechahora: new Date('2025-09-12T10:00:00Z'),
        },
        {
          id: 2,
          peso: 80,
          altura: 1.8,
          imc: 24.69,
          imcRedondeado: 24.69,
          categoria: 'Normal',
          fechahora: new Date('2025-09-11T10:00:00Z'),
        },
      ]);
      expect(mockImcRepository.findAll).toHaveBeenCalledWith(undefined, undefined);
    });
  });
  // Tests integrales para probar las catergorias de IMC
    it('debería devolver "Bajo peso" si IMC < 18.5', () => {
    const result = service.calcularImc({ peso: 50, altura: 1.80 }); // IMC ~15.43
    expect(result).toEqual({ imc: 15.43, categoria: 'Bajo peso' });
    expect(repository.create).toHaveBeenCalled();
  });

  it('debería devolver "Normal" si 18.5 ≤ IMC < 25', () => {
    const result = service.calcularImc({ peso: 70, altura: 1.75 }); // IMC ~22.86
    expect(result).toEqual({ imc: 22.86, categoria: 'Normal' });
    expect(repository.create).toHaveBeenCalled();
  });

  it('debería devolver "Sobrepeso" si 25 ≤ IMC < 30', () => {
    const result = service.calcularImc({ peso: 85, altura: 1.75 }); // IMC ~27.76
    expect(result).toEqual({ imc: 27.76, categoria: 'Sobrepeso' });
    expect(repository.create).toHaveBeenCalled();
  });

  it('debería devolver "Obeso" si IMC ≥ 30', () => {
    const result = service.calcularImc({ peso: 110, altura: 1.75 }); // IMC ~35.92
    expect(result).toEqual({ imc: 35.92, categoria: 'Obeso' });
    expect(repository.create).toHaveBeenCalled();
  });
});
