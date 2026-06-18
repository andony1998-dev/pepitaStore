import { IsString, MinLength, MaxLength, IsInt, IsPositive, IsOptional } from 'class-validator';

export class UpdateEstadoDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  nombre?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  ambitoId?: number;
}
