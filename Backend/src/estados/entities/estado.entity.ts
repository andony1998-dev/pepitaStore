import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Ambito } from '../../ambitos/entities/ambito.entity';

@Entity('estados')
export class Estado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  nombre: string;

  @Column({ name: 'ambito_id' })
  ambitoId: number;

  @ManyToOne(() => Ambito)
  @JoinColumn({ name: 'ambito_id' })
  ambito: Ambito;
}
