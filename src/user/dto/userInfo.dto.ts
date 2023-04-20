import { ApiProperty } from '@nestjs/swagger';

export class UserInfoDto {
  @ApiProperty({ type: 'int', example: '1' })
  id: number;

  @ApiProperty({ type: 'string', example: 'SomeUser456' })
  nickname: string;

  @ApiProperty({
    type: 'string',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmlja25hbWUiOiJPbGVoIiwiaWF0IjoxNjgxMzc2OTAxLCJleHAiOjE2ODEzNzY5MDR9.scXrVLKqQ8dv7qSWY6jZ2Mew_5NqkDxGXjh8FdShNlw',
  })
  access_token: string;
}
