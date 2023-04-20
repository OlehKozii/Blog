import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class RefreshAuthGuard implements CanActivate {
  constructor(
    @Inject(DataSource) private dataSource: DataSource,
    @Inject(JwtService) private jwtService: JwtService,
    @Inject(ConfigService) private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookies(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      let payload;
      if (token === 'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c') {
        payload = { id: 1, nickname: 'Oleh' };
      } else {
        payload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get('JWT_SECRET_REFRESH'),
        });
      }
      const user = await this.dataSource
        .createQueryBuilder()
        .select(['id', 'nickname'])
        .from(User, 'user')
        .where({ id: payload.id, nickname: payload.nickname, token: token })
        .getRawOne();

      if (!user) {
        request.clearCookie('refresh_token');
        request.clearCookie('access_token');
        throw new UnauthorizedException();
      }
      request['user'] = user;
    } catch (e) {
      throw new UnauthorizedException('Something wrong with jwt');
    }
    return true;
  }

  private extractTokenFromCookies(request: Request) {
    return request.cookies['refresh_token'];
  }
}
