import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { Rol } from './entities/rol.entity';
import { PermisoMenu } from '../permisos/entities/permiso-menu.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolesRepo: Repository<Rol>,
    @InjectRepository(PermisoMenu)
    private readonly permisosRepo: Repository<PermisoMenu>,
  ) {}

  findAll(): Promise<Rol[]> {
    return this.rolesRepo.find({ relations: ['permisos'], order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Rol> {
    const rol = await this.rolesRepo.findOne({
      where: { id },
      relations: ['permisos'],
    });
    if (!rol) throw new NotFoundException(`Rol con id ${id} no encontrado`);
    return rol;
  }

  async create(dto: CreateRoleDto): Promise<Rol> {
    const exists = await this.rolesRepo.findOne({ where: { nombre: dto.nombre } });
    if (exists) throw new ConflictException('Ya existe un rol con ese nombre');

    const rol = this.rolesRepo.create({ nombre: dto.nombre });

    if (dto.permiso_ids?.length) {
      rol.permisos = await this.permisosRepo.findBy({ id: In(dto.permiso_ids) });
    } else {
      rol.permisos = [];
    }

    const saved = await this.rolesRepo.save(rol);
    return this.findOne(saved.id);
  }

  async update(id: number, dto: UpdateRoleDto): Promise<Rol> {
    const rol = await this.findOne(id);

    if (dto.nombre && dto.nombre !== rol.nombre) {
      const dup = await this.rolesRepo.findOne({ where: { nombre: dto.nombre } });
      if (dup) throw new ConflictException('Ya existe un rol con ese nombre');
      rol.nombre = dto.nombre;
    }

    if (dto.permiso_ids !== undefined) {
      rol.permisos = dto.permiso_ids.length
        ? await this.permisosRepo.findBy({ id: In(dto.permiso_ids) })
        : [];
    }

    await this.rolesRepo.save(rol);
    return this.findOne(id);
  }
}
