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
import { MetodoPagoService } from './metodo-pago.service';
import { CreateMetodoPagoDto } from './dto/create-metodo-pago.dto';
import { UpdateMetodoPagoDto } from './dto/update-metodo-pago.dto';

@UseGuards(JwtAuthGuard)
@Controller('metodo-pago')
export class MetodoPagoController {
  constructor(private readonly metodoPagoService: MetodoPagoService) {}

  @Get()
  findAll() {
    return this.metodoPagoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.metodoPagoService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles('Administrador')
  @Post()
  create(@Body() dto: CreateMetodoPagoDto) {
    return this.metodoPagoService.create(dto);
  }

  @UseGuards(RolesGuard)
  @Roles('Administrador')
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMetodoPagoDto) {
    return this.metodoPagoService.update(id, dto);
  }
}
