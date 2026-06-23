import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MetodoPago } from './entities/metodo-pago.entity';
import { CreateMetodoPagoDto } from './dto/create-metodo-pago.dto';
import { UpdateMetodoPagoDto } from './dto/update-metodo-pago.dto';

@Injectable()
export class MetodoPagoService {
  constructor(
    @InjectRepository(MetodoPago)
    private readonly metodoPagoRepo: Repository<MetodoPago>,
  ) {}

  findAll(): Promise<MetodoPago[]> {
    return this.metodoPagoRepo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<MetodoPago> {
    const metodoPago = await this.metodoPagoRepo.findOne({ where: { id } });
    if (!metodoPago) throw new NotFoundException(`Método de pago con id ${id} no encontrado`);
    return metodoPago;
  }

  async create(dto: CreateMetodoPagoDto): Promise<MetodoPago> {
    const metodoPago = this.metodoPagoRepo.create(dto);
    return this.metodoPagoRepo.save(metodoPago);
  }

  async update(id: number, dto: UpdateMetodoPagoDto): Promise<MetodoPago> {
    const metodoPago = await this.findOne(id);
    Object.assign(metodoPago, dto);
    return this.metodoPagoRepo.save(metodoPago);
  }
}
