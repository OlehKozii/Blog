import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from '../database/entities/user.entity';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenUserInfoDto } from './dto/refreshTokenUserInfo.dto';
import * as argon2 from 'argon2';
import { argon2d } from 'argon2';
import { ConfigService } from '@nestjs/config';
import { validate } from 'class-validator';
import { handleErrors } from '../common/exceptionHandlers/exceptionHandler';

@Injectable()
export class UserService {
  constructor(
    @Inject(DataSource) private dataSource: DataSource,
    @Inject(JwtService) private jwtService: JwtService,
    @Inject(ConfigService) private configService: ConfigService,
  ) {}

  async signUp(res: Response, body: CreateUserDto) {
    try {
      if (!body.nickname || !body.password) {
        throw new BadRequestException('Not enough data');
      }
      const candidate = await this.findUser(body.nickname);
      if (candidate) {
        throw new ConflictException('User already exists');
      }
      const hash = await argon2.hash(body.password, { type: argon2d });
      let user: User = new User({ nickname: body.nickname, password: hash });
      await validate(user)
        .then((e) => {
          if (e.length > 0) {
            throw new BadRequestException();
          }
        })
        .catch((e) => {
          throw e;
        });
      user = (
        await this.dataSource
          .createQueryBuilder()
          .insert()
          .into(User)
          .values(user)
          .returning('*')
          .execute()
      ).raw[0];
      const tokens = await this.newTokens(user);
      user = new User(
        (
          await this.dataSource
            .createQueryBuilder()
            .update(User)
            .set({ token: tokens.refresh_token })
            .where({ id: user.id })
            .returning('*')
            .execute()
        ).raw[0],
      );
      await this.tokenToCookies(res, tokens, user.id);
      user['access_token'] = tokens.access_token;
      return user;
    } catch (e) {
      handleErrors(e);
    }
  }

  async signIn(res: Response, body: CreateUserDto) {
    try {
      if (!body.nickname || !body.password) {
        throw new BadRequestException('Not enough data');
      }
      const candidate = new User(await this.findUser(body.nickname));
      if (!candidate) {
        throw new NotFoundException('No such user');
      }
      if (!(await argon2.verify(candidate.password, body.password))) {
        throw new ForbiddenException('Wrong password');
      }
      const tokens = await this.newTokens(candidate);
      await this.tokenToCookies(res, tokens, candidate.id);
      candidate['access_token'] = tokens.access_token;
      return candidate;
    } catch (e) {
      handleErrors(e);
    }
  }

  async delete(user: RefreshTokenUserInfoDto) {
    try {
      return await this.dataSource
        .createQueryBuilder()
        .delete()
        .from(User)
        .where({ id: user.id })
        .execute();
    } catch (e) {
      handleErrors(e);
    }
  }

  async refreshToken(res: Response, user: RefreshTokenUserInfoDto) {
    try {
      const tokens = await this.newTokens(user);
      await this.tokenToCookies(res, tokens, user.id);
      return {
        ...user,
        access_token: tokens.access_token,
      };
    } catch (e) {
      handleErrors(e);
    }
  }

  async findUser(nickname: string) {
    return await this.dataSource
      .createQueryBuilder()
      .select()
      .from(User, 'user')
      .where({ nickname: nickname })
      .getRawOne();
  }

  async newTokens(payload: RefreshTokenUserInfoDto) {
    const access_token = await this.jwtService.signAsync(
      { id: payload.id, nickname: payload.nickname },
      {
        expiresIn: 1000 * 60 * 60 * 12,
        secret: this.configService.get('JWT_SECRET_ACCESS'),
      },
    );
    const refresh_token = await this.jwtService.signAsync(
      { id: payload.id, nickname: payload.nickname },
      {
        expiresIn: 1000 * 60 * 60 * 24 * 7,
        secret: this.configService.get('JWT_SECRET_REFRESH'),
      },
    );
    return { access_token, refresh_token };
  }

  async tokenToCookies(res: Response, tokens, id) {
    try {
      res.cookie('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      res.cookie('access_token', tokens.access_token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 12,
      });
      await this.dataSource
        .createQueryBuilder()
        .update(User)
        .set({ token: tokens.refresh_token })
        .where({ id: id })
        .returning('*')
        .execute();
    } catch (e) {
      handleErrors(e);
      throw new InternalServerErrorException();
    }
  }
}
