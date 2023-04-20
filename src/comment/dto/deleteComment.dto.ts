import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class DeleteCommentDto {
  @ApiProperty()
  @IsString()
  postId: string;

  @ApiProperty()
  @IsInt()
  id: number;
}
