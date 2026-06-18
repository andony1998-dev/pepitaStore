import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tipos_movimiento')
export class TipoMovimiento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  descripcion: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @Column({ type: 'int' })
  operacion: number;
}
