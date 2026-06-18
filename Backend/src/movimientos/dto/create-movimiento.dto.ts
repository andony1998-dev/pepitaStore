import {
  IsInt, IsPositive, IsOptional,
  IsDateString, IsArray,
  ValidateNested, ArrayMinSize, IsNumber, Min, Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDetalleMovimientoDto {
  @IsInt()
  @IsPositive()
  libroId: number;

  @IsInt()
  @IsPositive()
  cantidad: number;

  @IsNumber()
  @Min(0)
  precioUnitario: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  porcentajeDescuento?: number;

  @IsNumber()
  @Min(0)
  precioFinal: number;
}

export class CreateMovimientoDto {
  @IsInt()
  @IsPositive()
  tipoMovimientoId: number;

  @IsOptional()
  @IsDateString()
  fecha?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  clienteId?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  proveedorId?: number;

  @IsInt()
  @IsPositive()
  estadoId: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  eventoId?: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateDetalleMovimientoDto)
  detalles: CreateDetalleMovimientoDto[];
}
