import {
  Body,
  Controller,
  Delete,
  Inject,
  Post,
  UseGuards,
  Request,
  Res,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/createUser.dto';
import { AccessAuthGuard } from './guards/accessAuth.guard';
import { RefreshAuthGuard } from './guards/refreshAuth.guard';
import { UserInfo } from '../common/decorators/userDecorator';
import { UserInfoDto } from './dto/userInfo.dto';

@ApiTags('User')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(@Inject(UserService) private userService: UserService) {}

  @ApiOperation({ summary: 'Creates new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiOkResponse({ type: UserInfoDto })
  @Post('/signup')
  async signUp(@Res({ passthrough: true }) res, @Body() body: CreateUserDto) {
    return await this.userService.signUp(res, body);
  }

  @ApiOperation({ summary: 'Login new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiOkResponse({ type: UserInfoDto })
  @Post('/signin')
  async signIn(@Res({ passthrough: true }) res, @Body() body: CreateUserDto) {
    return await this.userService.signIn(res, body);
  }

  @UseGuards(AccessAuthGuard)
  @ApiOperation({ summary: 'Deletes user' })
  @ApiSecurity('access_token')
  @Delete('/')
  async delete(@Request() req) {
    return await this.userService.delete();
  }

  @UseGuards(RefreshAuthGuard)
  @ApiOperation({ summary: 'Refresh token' })
  @ApiOkResponse({ type: UserInfoDto })
  @ApiSecurity('refresh_token')
  @Post('/refresh')
  async refresh(@Res({ passthrough: true }) res, @UserInfo() user) {
    return this.userService.refreshToken(res, user);
  }
}
