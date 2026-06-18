import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Libro } from './entities/libro.entity';
import { CreateLibroDto } from './dto/create-libro.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';

@Injectable()
export class LibrosService {
  constructor(
    @InjectRepository(Libro)
    private readonly librosRepo: Repository<Libro>,
  ) {}

  findAll(page: number = 1, limit: number = 50): Promise<Libro[]> {
    return this.librosRepo.find({
      relations: ['autor'],
      order: { id: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne(id: number): Promise<Libro> {
    const libro = await this.librosRepo.findOne({
      where: { id },
      relations: ['autor'],
    });
    if (!libro) throw new NotFoundException(`Libro con id ${id} no encontrado`);
    return libro;
  }

  async create(dto: CreateLibroDto): Promise<Libro> {
    const dup = await this.librosRepo.findOne({ where: { isbn: dto.isbn } });
    if (dup) throw new ConflictException('Ya existe un libro con ese ISBN');

    const libro = this.librosRepo.create(dto);
    const saved = await this.librosRepo.save(libro);
    return this.findOne(saved.id);
  }

  async update(id: number, dto: UpdateLibroDto): Promise<Libro> {
    const libro = await this.findOne(id);

    if (dto.isbn && dto.isbn !== libro.isbn) {
      const dup = await this.librosRepo.findOne({ where: { isbn: dto.isbn } });
      if (dup) throw new ConflictException('Ya existe un libro con ese ISBN');
    }

    Object.assign(libro, dto);
    await this.librosRepo.save(libro);
    return this.findOne(id);
  }
}
