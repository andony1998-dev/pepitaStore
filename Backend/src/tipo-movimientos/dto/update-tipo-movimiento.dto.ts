import { IsString, MinLength, MaxLength, IsBoolean, IsOptional, IsInt, IsIn } from 'class-validator';

export class UpdateTipoMovimientoDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  descripcion?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsOptional()
  @IsInt()
  @IsIn([1, -1])
  operacion?: number;
}
