import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/common/guards/auth.guard';
import { DataSource } from 'typeorm';

describe('IMCController (e2e)', () => {
  jest.setTimeout(20000);
  let app: INestApplication;
  const testUserId = '123e4567-e89b-12d3-a456-426614174000'; // UUID fijo del usuario de prueba

  beforeAll(async () => {
    try {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: (context) => {
          const request = context.switchToHttp().getRequest();
          request.user = { userId: testUserId }; // Mock user object with userId
          return true;
        },
      })
      .compile();

      app = moduleFixture.createNestApplication();
      app.useGlobalPipes(new ValidationPipe());
      await app.init();

      // Obtener conexión a la base de datos y crear usuario de prueba
      const dataSource = app.get(DataSource);
      
      // Crear tabla users si no existe
      await dataSource.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      // Insertar usuario de prueba
      await dataSource.query(`
        INSERT INTO users (id, email, password) 
        VALUES ($1, $2, $3)
        ON CONFLICT (id) DO NOTHING;
      `, [testUserId, 'test@example.com', 'hashed_password']);
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
    
    if (res.status !== 201) {
      console.log('Error response:', res.body);
      console.log('Status:', res.status);
    }
    
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
