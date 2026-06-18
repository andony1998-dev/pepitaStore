import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TipoMovimientosService } from './tipo-movimientos.service';
import { CreateTipoMovimientoDto } from './dto/create-tipo-movimiento.dto';
import { UpdateTipoMovimientoDto } from './dto/update-tipo-movimiento.dto';

@UseGuards(JwtAuthGuard)
@Controller('tipo-movimientos')
export class TipoMovimientosController {
  constructor(private readonly tipoMovimientosService: TipoMovimientosService) {}

  @Get()
  findAll() {
    return this.tipoMovimientosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tipoMovimientosService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() dto: CreateTipoMovimientoDto) {
    return this.tipoMovimientosService.create(dto);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTipoMovimientoDto) {
    return this.tipoMovimientosService.update(id, dto);
  }
}
