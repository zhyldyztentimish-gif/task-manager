import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../prisma/prisma.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    })

    if (existingUser) {
      throw new ConflictException(
        'Пользователь с таким email уже существует',
      )
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10)

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
      },
    })

    return {
      message: 'Регистрация успешна',
      id: user.id,
      email: user.email,
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    })

    if (!user) {
      throw new UnauthorizedException(
        'Неверный email или пароль',
      )
    }

    const passwordMatch = await bcrypt.compare(
      dto.password,
      user.password,
    )

    if (!passwordMatch) {
      throw new UnauthorizedException(
        'Неверный email или пароль',
      )
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    })

    return {
      message: 'Вход выполнен успешно',
      accessToken,
      id: user.id,
      email: user.email,
    }
  }
}