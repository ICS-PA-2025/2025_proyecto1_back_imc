import { IImcRepository } from './IImcRepository';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateImcDto } from './dto/CreateImcDto';
import { Imc } from './imc.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ImcRepository implements IImcRepository {
  constructor(
    @InjectRepository(Imc)
    private readonly repository: Repository<Imc>,
  ) {}

  async create(data: CreateImcDto): Promise<Imc> {
    try {
      const nuevo = this.repository.create(data);
      return await this.repository.save(nuevo);
    } catch {
      throw new InternalServerErrorException(
        'Error al crear el registro de IMC',
      );
    }
  }
}
