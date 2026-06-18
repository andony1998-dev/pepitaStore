import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Movimiento } from './entities/movimiento.entity';
import { DetalleMovimiento } from './entities/detalle-movimiento.entity';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';

const RELATIONS_LIST = ['tipoMovimiento', 'cliente', 'proveedor', 'estado', 'evento', 'detalles'];
const RELATIONS_DETAIL = [...RELATIONS_LIST, 'detalles.libro', 'detalles.libro.autor'];

@Injectable()
export class MovimientosService {
  constructor(
    @InjectRepository(Movimiento)
    private readonly movimientoRepo: Repository<Movimiento>,
    @InjectRepository(DetalleMovimiento)
    private readonly detalleRepo: Repository<DetalleMovimiento>,
    private readonly dataSource: DataSource,
  ) {}

  findAll(operacion?: number, page: number = 1, limit: number = 50): Promise<Movimiento[]> {
    const where = operacion !== undefined
      ? { tipoMovimiento: { operacion } }
      : {};
    return this.movimientoRepo.find({
      where,
      relations: RELATIONS_LIST,
      order: { fecha: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne(id: number): Promise<Movimiento> {
    const mov = await this.movimientoRepo.findOne({
      where: { id },
      relations: RELATIONS_DETAIL,
    });
    if (!mov) throw new NotFoundException(`Movimiento #${id} no encontrado`);
    return mov;
  }

  async create(dto: CreateMovimientoDto, usuario: string): Promise<Movimiento> {
    return this.dataSource.transaction(async (manager) => {
      const movimiento = manager.create(Movimiento, {
        tipoMovimientoId: dto.tipoMovimientoId,
        fecha: dto.fecha ? new Date(dto.fecha) : new Date(),
        clienteId: dto.clienteId ?? null,
        proveedorId: dto.proveedorId ?? null,
        estadoId: dto.estadoId,
        usuario,
        eventoId: dto.eventoId ?? null,
      });
      const saved = await manager.save(movimiento);

      const detalles = dto.detalles.map((d) =>
        manager.create(DetalleMovimiento, {
          movimientoId: saved.id,
          libroId: d.libroId,
          cantidad: d.cantidad,
          precioUnitario: d.precioUnitario,
          porcentajeDescuento: d.porcentajeDescuento ?? 0,
          precioFinal: d.precioFinal,
        }),
      );
      await manager.save(detalles);

      return manager.findOneOrFail(Movimiento, {
        where: { id: saved.id },
        relations: RELATIONS_DETAIL,
      });
    });
  }
}
