import {
  IsString,
  IsEmail,
  IsInt,
  IsPositive,
  MinLength,
  MaxLength,
  IsOptional,
  IsStrongPassword,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsStrongPassword(
    { minLength: 8, minNumbers: 1, minUppercase: 1, minLowercase: 1, minSymbols: 1 },
    { message: 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un símbolo' },
  )
  password?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  rol_id?: number;
}
