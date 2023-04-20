import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ type: 'string', example: 'SomeUser456' })
  @IsString()
  nickname: string;

  @ApiProperty({ type: 'string', example: 'password123' })
  @IsString()
  password: string;
}
