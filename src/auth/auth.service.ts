import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface TokenValidationResponse {
  valid: boolean;
  user: any;
}

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService) {}

  async validateToken(token: string): Promise<TokenValidationResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<TokenValidationResponse>(
          `${process.env.AUTH_SERVICE_URL}/auth/validate`,
          { token },
          {
            timeout: 5000,
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new UnauthorizedException('Token inválido o expirado');
      }

      throw new HttpException(
        'Error al comunicarse con el servicio de autenticación',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
