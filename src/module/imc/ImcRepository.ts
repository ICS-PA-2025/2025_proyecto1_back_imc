import { IImcRepository } from './IImcRepository';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateImcDto } from './dto/CreateImcDto';
import { Imc } from './imc.entity';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

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

  async findAll(startDate?: string, endDate?: string): Promise<Imc[]> {
    const where: Record<string, unknown> = {};
    if (startDate || endDate) {
      if (startDate && endDate) {
        where.fechahora = Between(new Date(startDate), new Date(endDate));
      } else if (startDate) {
        where.fechahora = MoreThanOrEqual(new Date(startDate));
      } else if (endDate) {
        where.fechahora = LessThanOrEqual(new Date(endDate));
      }
    }
    return await this.repository.find({
      where,
      order: { fechahora: 'DESC' },
    });
  }
  async clear(): Promise<void> {
    await this.repository.clear();
  }
}
