import { IsString, MinLength, MaxLength, IsArray, IsInt, IsOptional } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  nombre: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  permiso_ids?: number[];
}
