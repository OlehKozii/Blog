import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ type: 'string', example: 'My comment' })
  @IsString()
  text: string;
}
