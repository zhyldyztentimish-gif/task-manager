import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers.authorization

    if (!authHeader) {
      throw new UnauthorizedException('Токен отсутствует')
    }

    const [type, token] = authHeader.split(' ')

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Неверный формат токена')
    }

    try {
      const payload = await this.jwtService.verifyAsync(token)

      request.user = payload

      return true
    } catch {
      throw new UnauthorizedException('Недействительный токен')
    }
  }
}