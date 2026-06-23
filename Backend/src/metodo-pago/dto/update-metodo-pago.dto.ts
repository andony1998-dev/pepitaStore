import { IsString, MinLength, MaxLength, IsBoolean, IsOptional } from 'class-validator';

export class UpdateMetodoPagoDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  descripcion?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
