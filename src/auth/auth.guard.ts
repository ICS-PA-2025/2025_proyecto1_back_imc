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
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { ResponseValidateDto } from './dto/response-validate.dto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      const authHeader: string = request.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Token no encontrado');
      }

      const token: string = authHeader.substring(7);

      // Validar con microservicio
      const response: AxiosResponse<ResponseValidateDto> = await firstValueFrom(
        this.httpService.get<ResponseValidateDto>(
          this.configService.get<string>('AUTH_API_URL') + '/auth/validate',
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            timeout: 10000,
          },
        ),
      );

      if (!response.data.valid) {
        throw new UnauthorizedException('Token inválido');
      }

      // Agregar datos del usuario a la request
      request.user = response.data.user;
      request.token = token;

      return true;
    } catch (error: any) {
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
