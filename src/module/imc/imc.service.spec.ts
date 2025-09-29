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
    it('debería calcular un IMC normal', async () => {
      const dto: CalcularImcDto = { altura: 1.75, peso: 70 };
      const userId = 'test-user-123';
      const result = await service.calcularImc(dto, userId);
      expect(result.imc).toBeCloseTo(22.86, 2);
      expect(result.categoria).toBe('Normal');
    });

    it('debería retornar "Bajo peso" si IMC < 18.5', async () => {
      const dto: CalcularImcDto = { altura: 1.75, peso: 50 };
      const result = await service.calcularImc(dto, '1');
      expect(result.imc).toBeCloseTo(16.33, 2);
      expect(result.categoria).toBe('Bajo peso');
    });

    it('debería retornar "Sobrepeso" si 25 <= IMC < 30', async () => {
      const dto: CalcularImcDto = { altura: 1.75, peso: 80 };
      const result = await service.calcularImc(dto, '1');
      expect(result.imc).toBeCloseTo(26.12, 2);
      expect(result.categoria).toBe('Sobrepeso');
    });

    it('debería retornar "Obeso" si IMC >= 30', async () => {
      const dto: CalcularImcDto = { altura: 1.75, peso: 100 };
      const result = await service.calcularImc(dto, '1');
      expect(result.imc).toBeCloseTo(32.65, 2);
      expect(result.categoria).toBe('Obeso');
    });

    // Casos inválidos (validaciones)
    it('debería lanzar error si el peso es <= 0', async () => {
      const dto: CalcularImcDto = { altura: 1.7, peso: 0 };
      await expect(service.calcularImc(dto, '1')).rejects.toThrow(
        new BadRequestException('El peso debe ser mayor a 0 y menor a 500 kg'),
      );
    });

    it('debería lanzar error si el peso es >= 500', async () => {
      const dto: CalcularImcDto = { altura: 1.7, peso: 500 };
      await expect(service.calcularImc(dto, '1')).rejects.toThrow(
        new BadRequestException('El peso debe ser mayor a 0 y menor a 500 kg'),
      );
    });

    it('debería lanzar error si la altura es <= 0', async () => {
      const dto: CalcularImcDto = { altura: 0, peso: 70 };
      await expect(service.calcularImc(dto, '1')).rejects.toThrow(
        new BadRequestException(
          'La altura debe ser mayor a 0 y menor a 3 metros',
        ),
      );
    });

    it('debería lanzar error si la altura es >= 3', async () => {
      const dto: CalcularImcDto = { altura: 3, peso: 70 };
      await expect(service.calcularImc(dto, '1')).rejects.toThrow(
        new BadRequestException(
          'La altura debe ser mayor a 0 y menor a 3 metros',
        ),
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

      const result = await service.findAll(
        '123e4567-e89b-12d3-a456-426614174000',
      );
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
      expect(mockImcRepository.findAll).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
        undefined,
        undefined,
      );
    });
  });
  // Tests integrales para probar las catergorias de IMC
  it('debería devolver "Bajo peso" si IMC < 18.5', async () => {
    const result = await service.calcularImc({ peso: 50, altura: 1.8 }, '1'); // IMC ~15.43
    expect(result).toEqual({ imc: 15.43, categoria: 'Bajo peso' });
    expect(mockImcRepository.create).toHaveBeenCalled();
  });

  it('debería devolver "Normal" si 18.5 ≤ IMC < 25', async () => {
    const result = await service.calcularImc({ peso: 70, altura: 1.75 }, '1'); // IMC ~22.86
    expect(result).toEqual({ imc: 22.86, categoria: 'Normal' });
    expect(mockImcRepository.create).toHaveBeenCalled();
  });

  it('debería devolver "Sobrepeso" si 25 ≤ IMC < 30', async () => {
    const result = await service.calcularImc({ peso: 85, altura: 1.75 }, '1'); // IMC ~27.76
    expect(result).toEqual({ imc: 27.76, categoria: 'Sobrepeso' });
    expect(mockImcRepository.create).toHaveBeenCalled();
  });

  it('debería devolver "Obeso" si IMC ≥ 30', async () => {
    const result = await service.calcularImc({ peso: 110, altura: 1.75 }, '1'); // IMC ~35.92
    expect(result).toEqual({ imc: 35.92, categoria: 'Obeso' });
    expect(mockImcRepository.create).toHaveBeenCalled();
  });

  // Tests integrales para probar las catergorias de IMC
  it('debería devolver "Bajo peso" si IMC < 18.5', async () => {
    const result = await service.calcularImc({ peso: 50, altura: 1.80 }, '1'); // IMC ~15.43
    expect(result).toEqual({ imc: 15.43, categoria: 'Bajo peso' });
    expect(mockImcRepository.create).toHaveBeenCalled();
  });

  it('debería devolver "Normal" si 18.5 ≤ IMC < 25', async () => {
    const result = await service.calcularImc({ peso: 70, altura: 1.75 }, '1'); // IMC ~22.86
    expect(result).toEqual({ imc: 22.86, categoria: 'Normal' });
    expect(mockImcRepository.create).toHaveBeenCalled();
  });

  it('debería devolver "Sobrepeso" si 25 ≤ IMC < 30', async () => {
    const result = await service.calcularImc({ peso: 85, altura: 1.75 }, '1'); // IMC ~27.76
    expect(result).toEqual({ imc: 27.76, categoria: 'Sobrepeso' });
    expect(mockImcRepository.create).toHaveBeenCalled();
  });

  it('debería devolver "Obeso" si IMC ≥ 30', async () => {
    const result = await service.calcularImc({ peso: 110, altura: 1.75 }, '1'); // IMC ~35.92
    expect(result).toEqual({ imc: 35.92, categoria: 'Obeso' });
    expect(mockImcRepository.create).toHaveBeenCalled();
  });

  describe('ImcService.findAllAndStats', () => {
    const mkItem = (overrides: Partial<any> = {}): any => ({
      id: overrides.id ?? '1',
      peso: overrides.peso ?? '70.00',
      altura: overrides.altura ?? '1.70',
      imc: overrides.imc ?? '22.00',
      imcRedondeado: overrides.imcRedondeado ?? 22.0,
      categoria: overrides.categoria ?? 'Normal',
      fechahora: overrides.fechahora ?? new Date('2025-01-01T10:00:00Z'),
    });

    let mockRepo: { findAll: jest.Mock };
    let service: ImcService;

    beforeEach(() => {
      mockRepo = { findAll: jest.fn() };
      service = new ImcService(mockRepo as any);
    });

    it('devuelve vacio y ceros cuando no hay datos', async () => {
      mockRepo.findAll.mockResolvedValueOnce([]);

      const res = await service.findAllAndStats('u1');

      expect(res.items).toEqual([]);
      expect(res.stats.total).toBe(0);
      expect(res.stats.promedioPeso).toBe(0);
      expect(res.stats.promedioImc).toBe(0);
    });

    it('calcula promedio', async () => {
      const a = mkItem({
        id: 'a',
        fechahora: new Date('2025-01-02T10:00:00Z'),
        peso: 80.00,
        imc: 22.00,
      });
      const b = mkItem({
        id: 'b',
        fechahora: new Date('2025-01-01T10:00:00Z'),
        peso: 70.00,
        imc: 21.00,
      });
      const c = mkItem({
        id: 'c',
        fechahora: new Date('2025-01-03T10:00:00Z'),
        peso: 60.00,
        imc: 23.00,
      });

      mockRepo.findAll.mockResolvedValueOnce([a, b, c]);

      const res = await service.findAllAndStats('u1');

      expect(res.items.map(i => i.id)).toEqual(['b', 'a', 'c']);

      expect(res.stats.promedioPeso).toBeCloseTo(70, 3);
      expect(res.stats.promedioImc).toBeCloseTo(22, 3);
    });

    it('pasa correctamente los filtros al repositorio', async () => {
      mockRepo.findAll.mockResolvedValueOnce([mkItem()]);
      const start = '2025-01-01';
      const end = '2025-01-31';

      await service.findAllAndStats('u1', start, end);

      expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
      expect(mockRepo.findAll).toHaveBeenCalledWith('u1', start, end);
    });
  });
});
