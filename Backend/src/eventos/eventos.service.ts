import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Evento } from './entities/evento.entity';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';

@Injectable()
export class EventosService {
  constructor(
    @InjectRepository(Evento)
    private readonly eventosRepo: Repository<Evento>,
  ) {}

  findAll(): Promise<Evento[]> {
    return this.eventosRepo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Evento> {
    const evento = await this.eventosRepo.findOne({ where: { id } });
    if (!evento) throw new NotFoundException(`Evento con id ${id} no encontrado`);
    return evento;
  }

  async create(dto: CreateEventoDto): Promise<Evento> {
    const evento = this.eventosRepo.create(dto);
    return this.eventosRepo.save(evento);
  }

  async update(id: number, dto: UpdateEventoDto): Promise<Evento> {
    const evento = await this.findOne(id);
    Object.assign(evento, dto);
    return this.eventosRepo.save(evento);
  }
}
