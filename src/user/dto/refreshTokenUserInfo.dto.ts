import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenUserInfoDto {
  @ApiProperty({ type: 'int', example: '1' })
  id: number;

  @ApiProperty({ type: 'string', example: 'SomeUser456' })
  nickname: string;
}
