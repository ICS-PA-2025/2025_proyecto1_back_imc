import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Imc extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({
    required: true,
    type: Number,
    set: (val: number) => Math.round(val * 100) / 100,
  })
  peso: number;

  @Prop({
    required: true,
    type: Number,
    set: (val: number) => Math.round(val * 100) / 100,
  })
  altura: number;

  @Prop({
    required: true,
    type: Number,
    set: (val: number) => Math.round(val * 100) / 100,
  })
  imc: number;

  @Prop({
    required: true,
    type: Number,
    set: (val: number) => Math.round(val * 100) / 100,
  })
  imcRedondeado: number;

  @Prop({ required: true })
  categoria: string;

  @Prop({ default: Date.now })
  fechahora: Date;

  constructor(
    peso: number,
    altura: number,
    imc: number,
    imcRedondeado: number,
    categoria: string,
  ) {
    super();
    this.peso = peso;
    this.altura = altura;
    this.imc = imc;
    this.imcRedondeado = imcRedondeado;
    this.categoria = categoria;
    this.fechahora = new Date();
  }
}

export const ImcSchema = SchemaFactory.createForClass(Imc);
