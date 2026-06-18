import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ambitos')
export class Ambito {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  descripcion: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;
}
