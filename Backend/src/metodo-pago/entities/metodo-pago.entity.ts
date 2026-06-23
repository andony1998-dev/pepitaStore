import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('metodo_pago')
export class MetodoPago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  descripcion: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;
}
