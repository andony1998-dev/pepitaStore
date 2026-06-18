import { IsString, IsEmail, IsInt, IsPositive, MinLength, MaxLength, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @IsEmail()
  email: string;

  @IsStrongPassword(
    { minLength: 8, minNumbers: 1, minUppercase: 1, minLowercase: 1, minSymbols: 1 },
    { message: 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un símbolo' },
  )
  password: string;

  @IsInt()
  @IsPositive()
  rol_id: number;
}
