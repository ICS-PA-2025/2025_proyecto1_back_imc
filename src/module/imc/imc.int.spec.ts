import * as dotenv from 'dotenv';
dotenv.config();

import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { ImcService } from './imc.service';
import { ImcRepository } from './ImcRepository';
import { Imc } from './imc.entity';
import { CalcularImcDto } from './dto/calcular-imc-dto';
import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';


const shouldRunIntegrationTests = process.env.DB_HOST && process.env.DB_HOST !== '';

(shouldRunIntegrationTests ? describe : describe.skip)('ImcService (integración, PostgreSQL real)', () => {
  jest.setTimeout(30000); // 30 segundos timeout para conexión DB
  let service: ImcService;
  let repository: Repository<Imc>;
  let moduleRef: TestingModule;
  const testUserId = '123e4567-e89b-12d3-a456-426614174000'; // UUID válido hardcodeado para los tests

  beforeAll(async () => {
    // Skip tests if no DB config
    if (!process.env.DB_HOST) {
      console.log('Skipping integration tests - No DB_HOST configured');
      return;
    }
    
    try {
      moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_TEST_NAME || process.env.DB_NAME,
          entities: [Imc],
          synchronize: true,
          dropSchema: true,
          ssl: process.env.DB_SSL === 'true' 
            ? { rejectUnauthorized: false } 
            : false,
        }),
        TypeOrmModule.forFeature([Imc]),
      ],
      providers: [
        ImcService,
        { provide: 'IImcRepository', useClass: ImcRepository },
      ],
    }).compile();

    service = moduleRef.get<ImcService>(ImcService);
    repository = moduleRef.get<Repository<Imc>>(getRepositoryToken(Imc));
    } catch (error) {
      console.log('Error connecting to database for integration tests:', error.message);
      throw error;
    }
  }, 30000); // 30 segundos timeout para setup

  afterEach(async () => {
    // Limpia los datos entre tests
    if (repository) {
      await repository.clear();
    }
  });

  afterAll(async () => {
    // Cierra la conexión a la base de datos
    if (moduleRef) {
      await moduleRef.close();
    }
  });

  it('debería calcular y guardar un IMC normal', async () => {
    if (!service || !repository) {
      console.log('Skipping test - Database not available');
      return;
    }
    
    const dto: CalcularImcDto = { altura: 1.75, peso: 70 };
    const result = await service.calcularImc(dto, testUserId);

    expect(result.imc).toBeCloseTo(22.86, 2);
    expect(result.categoria).toBe('Normal');

    const records = await repository.find();
    expect(records.length).toBe(1);
  });  it('debería lanzar error si el peso es <= 0', async () => {
    const dto: CalcularImcDto = { altura: 1.70, peso: 0 };
  await expect(service.calcularImc(dto, testUserId)).rejects.toThrow(BadRequestException);

    const records = await repository.find();
    expect(records.length).toBe(0);
  });

  it('findAll debería retornar el historial completo', async () => {
  await service.calcularImc({ altura: 1.75, peso: 70 }, testUserId);
  await service.calcularImc({ altura: 1.80, peso: 80 }, testUserId);

    const result = await service.findAll(testUserId);
    expect(result.length).toBe(2);
  });

  it('debería retornar "Bajo peso" si IMC < 18.5 y guardar', async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 50 };
  const result = await service.calcularImc(dto, testUserId);
    expect(result.imc).toBeCloseTo(16.33, 2);
    expect(result.categoria).toBe('Bajo peso');
    const records = await repository.find();
    expect(records.length).toBe(1);
    expect(records[0].categoria).toBe('Bajo peso');
  });

  it('debería retornar "Sobrepeso" si 25 <= IMC < 30 y guardar', async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 80 };
  const result = await service.calcularImc(dto, testUserId);
    expect(result.imc).toBeCloseTo(26.12, 2);
    expect(result.categoria).toBe('Sobrepeso');
    const records = await repository.find();
    expect(records.length).toBe(1);
    expect(records[0].categoria).toBe('Sobrepeso');
  });

  it('debería retornar "Obeso" si IMC >= 30 y guardar', async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 100 };
  const result = await service.calcularImc(dto, testUserId);
    expect(result.imc).toBeCloseTo(32.65, 2);
    expect(result.categoria).toBe('Obeso');
    const records = await repository.find();
    expect(records.length).toBe(1);
    expect(records[0].categoria).toBe('Obeso');
  });

  it('debería lanzar error si la altura es >= 3', async () => {
    const dto: CalcularImcDto = { altura: 3, peso: 70 };
  await expect(service.calcularImc(dto, testUserId)).rejects.toThrow(BadRequestException);
    const records = await repository.find();
    expect(records.length).toBe(0);
  });

  it('debería lanzar error si la altura es <= 0', async () => {
    const dto: CalcularImcDto = { altura: 0, peso: 70 };
  await expect(service.calcularImc(dto, testUserId)).rejects.toThrow(BadRequestException);
    const records = await repository.find();
    expect(records.length).toBe(0);
  });

  it('debería lanzar error si el peso es >= 500', async () => {
    const dto: CalcularImcDto = { altura: 1.70, peso: 500 };
  await expect(service.calcularImc(dto, testUserId)).rejects.toThrow(BadRequestException);
    const records = await repository.find();
    expect(records.length).toBe(0);
  });
});
