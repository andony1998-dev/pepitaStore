import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Estado } from './entities/estado.entity';
import { CreateEstadoDto } from './dto/create-estado.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';

@Injectable()
export class EstadosService {
  constructor(
    @InjectRepository(Estado)
    private readonly estadosRepo: Repository<Estado>,
  ) {}

  findAll(): Promise<Estado[]> {
    return this.estadosRepo.find({ relations: ['ambito'], order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Estado> {
    const estado = await this.estadosRepo.findOne({ where: { id }, relations: ['ambito'] });
    if (!estado) throw new NotFoundException(`Estado con id ${id} no encontrado`);
    return estado;
  }

  async create(dto: CreateEstadoDto): Promise<Estado> {
    const estado = this.estadosRepo.create(dto);
    const saved = await this.estadosRepo.save(estado);
    return this.findOne(saved.id);
  }

  async update(id: number, dto: UpdateEstadoDto): Promise<Estado> {
    const estado = await this.findOne(id);
    Object.assign(estado, dto);
    await this.estadosRepo.save(estado);
    return this.findOne(id);
  }
}
