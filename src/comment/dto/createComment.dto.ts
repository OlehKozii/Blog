import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsInt()
  postId: number;
}
