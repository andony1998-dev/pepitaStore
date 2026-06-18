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
import { AmbitosService } from './ambitos.service';
import { CreateAmbitoDto } from './dto/create-ambito.dto';
import { UpdateAmbitoDto } from './dto/update-ambito.dto';

@UseGuards(JwtAuthGuard)
@Controller('ambitos')
export class AmbitosController {
  constructor(private readonly ambitosService: AmbitosService) {}

  @Get()
  findAll() {
    return this.ambitosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ambitosService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() dto: CreateAmbitoDto) {
    return this.ambitosService.create(dto);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAmbitoDto) {
    return this.ambitosService.update(id, dto);
  }
}
