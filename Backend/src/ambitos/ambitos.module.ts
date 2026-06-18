import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ambito } from './entities/ambito.entity';
import { AmbitosService } from './ambitos.service';
import { AmbitosController } from './ambitos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Ambito])],
  controllers: [AmbitosController],
  providers: [AmbitosService],
})
export class AmbitosModule {}
