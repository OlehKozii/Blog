import { ApiProperty } from '@nestjs/swagger';

export class PostDto {
  @ApiProperty({ type: 'number', example: 1 })
  id: number;

  @ApiProperty({ type: 'string', example: 'My comment' })
  text: string;
}
