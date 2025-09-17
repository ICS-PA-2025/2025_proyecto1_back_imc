import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('IMCController (e2e)', () => {
  jest.setTimeout(20000);
  let app: INestApplication;

  beforeAll(async () => {
    try {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      app.useGlobalPipes(new ValidationPipe());
      await app.init();
    } catch (err) {
      console.error('Error en beforeAll:', err);
      throw err;
    }
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('/imc/calcular (POST) debe calcular IMC correctamente', async () => {
    const dto = { altura: 1.75, peso: 70 };
    const res = await request(app.getHttpServer())
      .post('/imc/calcular')
      .send(dto);
    expect(res.status).toBe(201);
    expect(res.body.imc).toBeCloseTo(22.86, 2);
    expect(res.body.categoria).toBe('Normal');
  });

  it('/imc (GET) debe devolver historial (puede estar vacío)', async () => {
    const res = await request(app.getHttpServer())
      .get('/imc');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
