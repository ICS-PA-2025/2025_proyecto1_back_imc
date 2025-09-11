import { CreateImcDto } from './dto/CreateImcDto';
import { Imc } from './imc.entity';

export interface IImcRepository {
  create(data: CreateImcDto): Promise<Imc>;

  findAll(): Promise<Imc[]>;
}
