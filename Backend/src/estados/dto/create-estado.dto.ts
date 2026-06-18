import { IsString, MinLength, MaxLength, IsInt, IsPositive } from 'class-validator';

export class CreateEstadoDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  nombre: string;

  @IsInt()
  @IsPositive()
  ambitoId: number;
}
