import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('autores')
export class Autor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombre_completo: string;

  @Column({ type: 'date', nullable: true })
  fecha_nacimiento: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nacionalidad: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  genero_literario: string;
}
