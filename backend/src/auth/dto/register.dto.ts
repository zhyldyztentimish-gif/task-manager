import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'

export class RegisterDto {
  @IsEmail({}, { message: 'Введите корректный email' })
  @IsNotEmpty({ message: 'Введите email' })
  email!: string

  @IsNotEmpty({ message: 'Введите пароль' })
  @MinLength(6, {
    message: 'Пароль должен содержать минимум 6 символов',
  })
  password!: string
}