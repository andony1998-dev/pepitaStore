import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Movimiento } from './movimiento.entity';
import { Libro } from '../../libros/entities/libro.entity';

@Entity('detalle_movimientos')
export class DetalleMovimiento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'movimiento_id' })
  movimientoId: number;

  @ManyToOne(() => Movimiento, (m) => m.detalles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movimiento_id' })
  movimiento: Movimiento;

  @Column({ name: 'libro_id' })
  libroId: number;

  @ManyToOne(() => Libro)
  @JoinColumn({ name: 'libro_id' })
  libro: Libro;

  @Column({ type: 'int' })
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'precio_unitario', default: 0 })
  precioUnitario: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'porcentaje_descuento', default: 0 })
  porcentajeDescuento: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'precio_final', default: 0 })
  precioFinal: number;
}
