import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('permisos_menu')
export class PermisoMenu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nombre_opcion', length: 100 })
  nombre_opcion: string;

  @Column({ length: 100 })
  ruta: string;
}
