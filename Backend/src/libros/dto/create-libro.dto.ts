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

export class CreateLibroDto {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  titulo: string;

  @IsString()
  @MinLength(1)
  @MaxLength(20)
  isbn: string;

  @IsOptional()
  @IsDateString()
  fecha_publicacion?: string;

  @IsNumber()
  @Min(0)
  precio: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsInt()
  autor_id: number;
}
