import { IsString, MinLength, MaxLength, IsOptional, IsDateString } from 'class-validator';

export class CreateAutorDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  nombre_completo: string;

  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  nacionalidad?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  genero_literario?: string;
}
