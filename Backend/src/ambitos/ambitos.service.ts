import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Ambito } from './entities/ambito.entity';
import { CreateAmbitoDto } from './dto/create-ambito.dto';
import { UpdateAmbitoDto } from './dto/update-ambito.dto';

@Injectable()
export class AmbitosService {
  constructor(
    @InjectRepository(Ambito)
    private readonly ambitosRepo: Repository<Ambito>,
  ) {}

  findAll(): Promise<Ambito[]> {
    return this.ambitosRepo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Ambito> {
    const ambito = await this.ambitosRepo.findOne({ where: { id } });
    if (!ambito) throw new NotFoundException(`Ámbito con id ${id} no encontrado`);
    return ambito;
  }

  async create(dto: CreateAmbitoDto): Promise<Ambito> {
    const ambito = this.ambitosRepo.create(dto);
    return this.ambitosRepo.save(ambito);
  }

  async update(id: number, dto: UpdateAmbitoDto): Promise<Ambito> {
    const ambito = await this.findOne(id);
    Object.assign(ambito, dto);
    return this.ambitosRepo.save(ambito);
  }
}
