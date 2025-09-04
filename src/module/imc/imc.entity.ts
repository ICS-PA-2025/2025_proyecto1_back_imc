import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Imc {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 5, scale: 2 })
  peso: number;

  @Column('decimal', { precision: 5, scale: 2 })
  altura: number;

  @Column('decimal', { precision: 5, scale: 2 })
  imc: number;

  @Column('decimal', { precision: 5, scale: 2 })
  imcRedondeado: number;

  @Column()
  categoria: string;

  constructor(
    peso: number,
    altura: number,
    imc: number,
    imcRedondeado: number,
    categoria: string,
  ) {
    this.peso = peso;
    this.altura = altura;
    this.imc = imc;
    this.imcRedondeado = imcRedondeado;
    this.categoria = categoria;
  }
}
