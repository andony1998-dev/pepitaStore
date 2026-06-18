import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsInt,
  IsPositive,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'El username es requerido' })
  @MaxLength(50, { message: 'El username no puede superar los 50 caracteres' })
  username: string;

  @IsEmail({}, { message: 'El email no tiene un formato válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @IsStrongPassword(
    { minLength: 8, minNumbers: 1, minUppercase: 1, minLowercase: 1, minSymbols: 1 },
    { message: 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un símbolo' },
  )
  password: string;

  @IsInt({ message: 'El rol_id debe ser un número entero' })
  @IsPositive({ message: 'El rol_id debe ser positivo' })
  rol_id: number;
}
