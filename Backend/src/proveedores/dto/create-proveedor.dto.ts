import { IsString, IsOptional, IsBoolean, MinLength, MaxLength, IsEmail } from 'class-validator';

export class CreateProveedorDto {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  nombreProveedor: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  direccion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono2?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
