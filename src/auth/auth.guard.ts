import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly httpService: HttpService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      const authHeader = request.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Token no encontrado');
      }

      const token = authHeader.substring(7);

      console.log('Token:', token);

      // Validar con microservicio
      const response = await firstValueFrom(
        this.httpService.post(
          'http://localhost:3001/auth/validate',
          {
            token: token,
          },
          {
            timeout: 5000,
          },
        ),
      );

      console.log('llego acaaaaa');

      console.log('Response from auth service:', response);

      // Agregar datos del usuario a la request
      request['user'] = response.data.user;
      request['token'] = token;

      return true;
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
