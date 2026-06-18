import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import { TipoMovimiento } from '../../tipo-movimientos/entities/tipo-movimiento.entity';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { Proveedor } from '../../proveedores/entities/proveedor.entity';
import { Estado } from '../../estados/entities/estado.entity';
import { Evento } from '../../eventos/entities/evento.entity';
import { DetalleMovimiento } from './detalle-movimiento.entity';

@Entity('movimientos')
export class Movimiento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tipo_movimiento_id' })
  tipoMovimientoId: number;

  @ManyToOne(() => TipoMovimiento)
  @JoinColumn({ name: 'tipo_movimiento_id' })
  tipoMovimiento: TipoMovimiento;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @Column({ name: 'cliente_id', type: 'int', nullable: true })
  clienteId: number | null;

  @ManyToOne(() => Cliente, { nullable: true })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente | null;

  @Column({ name: 'proveedor_id', type: 'int', nullable: true })
  proveedorId: number | null;

  @ManyToOne(() => Proveedor, { nullable: true })
  @JoinColumn({ name: 'proveedor_id' })
  proveedor: Proveedor | null;

  @Column({ name: 'estado_id' })
  estadoId: number;

  @ManyToOne(() => Estado)
  @JoinColumn({ name: 'estado_id' })
  estado: Estado;

  @Column({ type: 'varchar', length: 100 })
  usuario: string;

  @Column({ name: 'evento_id', type: 'int', nullable: true })
  eventoId: number | null;

  @ManyToOne(() => Evento, { nullable: true })
  @JoinColumn({ name: 'evento_id' })
  evento: Evento | null;

  @OneToMany(() => DetalleMovimiento, (d) => d.movimiento, { cascade: true })
  detalles: DetalleMovimiento[];
}
