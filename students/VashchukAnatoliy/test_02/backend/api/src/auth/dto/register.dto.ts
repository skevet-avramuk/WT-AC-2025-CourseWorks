import { IsEmail, IsNotEmpty, IsString, Matches, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'Введите корректное имя пользователя (латиница, цифры, подчёркивание).' })
  @MinLength(3, {
    message: 'Введите корректное имя пользователя (латиница, цифры, подчёркивание).',
  })
  @MaxLength(32, {
    message: 'Введите корректное имя пользователя (латиница, цифры, подчёркивание).',
  })
  @Matches(/^[A-Za-z0-9_]{3,32}$/, {
    message: 'Введите корректное имя пользователя (латиница, цифры, подчёркивание).',
  })
  username: string;

  @IsEmail({}, { message: 'Введите корректный email.' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Введите пароль (не менее 6 символов).' })
  password: string;
}
