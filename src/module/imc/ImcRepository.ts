import { IImcRepository } from './IImcRepository';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateImcDto } from './dto/CreateImcDto';
import { Imc } from './imc.schema';
import { Model } from 'mongoose';

@Injectable()
export class ImcRepository implements IImcRepository {
  constructor(
    @InjectModel(Imc.name)
    private readonly imcModel: Model<Imc>,
  ) {}

  async create(data: CreateImcDto): Promise<Imc> {
    try {
      const nuevo = new this.imcModel(data);
      return await nuevo.save();
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al crear el registro de IMC',
      );
    }
  }

  async findAll(
    userId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<Imc[]> {
    const filter: Record<string, unknown> = { userId }; // Always filter by userId

    if (startDate || endDate) {
      const dateFilter: Record<string, Date> = {};
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);
      filter.fechahora = dateFilter;
    }

    return await this.imcModel.find(filter).sort({ fechahora: -1 }).exec();
  }
  async clear(): Promise<void> {
    await this.imcModel.deleteMany({}).exec();
  }
}
