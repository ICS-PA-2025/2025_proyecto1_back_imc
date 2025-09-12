import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly httpService: HttpService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Extraer token del header Authorization
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Token no encontrado');
      }

      const token = authHeader.substring(7); // Remover 'Bearer '

      // Validar token con microservicio de autenticación
      const response = await firstValueFrom(
        this.httpService.post(
          'http://auth-service:3001/auth/validate',
          {
            token: token,
          },
          {
            timeout: 5000, // 5 segundos timeout
          },
        ),
      );

      // Si la validación es exitosa, agregar información del usuario a la request
      req['user'] = response.data.user;
      req['token'] = token;

      next();
    } catch (error) {
      if (error.response?.status === 401) {
        throw new UnauthorizedException('Token inválido o expirado');
      }

      throw new HttpException(
        'Error al validar token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
