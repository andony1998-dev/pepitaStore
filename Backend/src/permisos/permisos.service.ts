import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermisoMenu } from './entities/permiso-menu.entity';

@Injectable()
export class PermisosService {
  constructor(
    @InjectRepository(PermisoMenu)
    private readonly permisosRepo: Repository<PermisoMenu>,
  ) {}

  findAll(): Promise<PermisoMenu[]> {
    return this.permisosRepo.find({ order: { id: 'ASC' } });
  }
}
