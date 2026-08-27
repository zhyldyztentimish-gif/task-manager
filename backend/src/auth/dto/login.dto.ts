import { IsEmail, IsNotEmpty } from 'class-validator'

export class LoginDto {
  @IsEmail({}, { message: 'Введите корректный email' })
  @IsNotEmpty({ message: 'Введите email' })
  email!: string

  @IsNotEmpty({ message: 'Введите пароль' })
  password!: string
}