import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoMovimiento } from './entities/tipo-movimiento.entity';
import { TipoMovimientosService } from './tipo-movimientos.service';
import { TipoMovimientosController } from './tipo-movimientos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TipoMovimiento])],
  controllers: [TipoMovimientosController],
  providers: [TipoMovimientosService],
})
export class TipoMovimientosModule {}
