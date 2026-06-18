import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TipoMovimiento } from './entities/tipo-movimiento.entity';
import { CreateTipoMovimientoDto } from './dto/create-tipo-movimiento.dto';
import { UpdateTipoMovimientoDto } from './dto/update-tipo-movimiento.dto';

@Injectable()
export class TipoMovimientosService {
  constructor(
    @InjectRepository(TipoMovimiento)
    private readonly tipoMovimientosRepo: Repository<TipoMovimiento>,
  ) {}

  findAll(): Promise<TipoMovimiento[]> {
    return this.tipoMovimientosRepo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<TipoMovimiento> {
    const tipo = await this.tipoMovimientosRepo.findOne({ where: { id } });
    if (!tipo) throw new NotFoundException(`Tipo de movimiento con id ${id} no encontrado`);
    return tipo;
  }

  async create(dto: CreateTipoMovimientoDto): Promise<TipoMovimiento> {
    const tipo = this.tipoMovimientosRepo.create(dto);
    return this.tipoMovimientosRepo.save(tipo);
  }

  async update(id: number, dto: UpdateTipoMovimientoDto): Promise<TipoMovimiento> {
    const tipo = await this.findOne(id);
    Object.assign(tipo, dto);
    return this.tipoMovimientosRepo.save(tipo);
  }
}
