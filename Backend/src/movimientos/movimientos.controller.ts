import {
  Controller, Get, Post, Param, Body,
  UseGuards, ParseIntPipe, Query, Req, DefaultValuePipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MovimientosService } from './movimientos.service';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';

@UseGuards(JwtAuthGuard)
@Controller('movimientos')
export class MovimientosController {
  constructor(private readonly movimientosService: MovimientosService) {}

  @Get()
  findAll(
    @Query('operacion') operacion?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number = 50,
  ) {
    const op = operacion !== undefined ? Number(operacion) : undefined;
    return this.movimientosService.findAll(op, page, Math.min(limit, 100));
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.movimientosService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles('admin', 'gerente')
  @Post()
  create(@Body() dto: CreateMovimientoDto, @Req() req: { user: { username: string } }) {
    const usuario = (req.user as { username: string }).username;
    return this.movimientosService.create(dto, usuario);
  }
}
