import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Autor } from './entities/autor.entity';
import { CreateAutorDto } from './dto/create-autor.dto';
import { UpdateAutorDto } from './dto/update-autor.dto';

@Injectable()
export class AutoresService {
  constructor(
    @InjectRepository(Autor)
    private readonly autoresRepo: Repository<Autor>,
  ) {}

  findAll(page: number = 1, limit: number = 50): Promise<Autor[]> {
    return this.autoresRepo.find({
      order: { id: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne(id: number): Promise<Autor> {
    const autor = await this.autoresRepo.findOne({ where: { id } });
    if (!autor) throw new NotFoundException(`Autor con id ${id} no encontrado`);
    return autor;
  }

  async create(dto: CreateAutorDto): Promise<Autor> {
    const autor = this.autoresRepo.create(dto);
    return this.autoresRepo.save(autor);
  }

  async update(id: number, dto: UpdateAutorDto): Promise<Autor> {
    const autor = await this.findOne(id);
    Object.assign(autor, dto);
    return this.autoresRepo.save(autor);
  }
}
