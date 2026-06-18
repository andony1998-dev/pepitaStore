import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsDateString,
  IsNumber,
  IsInt,
  Min,
} from 'class-validator';

export class UpdateLibroDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  titulo?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  isbn?: string;

  @IsOptional()
  @IsDateString()
  fecha_publicacion?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  precio?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsInt()
  autor_id?: number;
}
