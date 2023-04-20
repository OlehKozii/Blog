import { ApiProperty } from '@nestjs/swagger';

class CommentInfoDto {
  @ApiProperty({ type: 'number', example: 1 })
  id: number;

  @ApiProperty({ type: 'string', example: 'My comment' })
  text: string;

  @ApiProperty({ type: 'string', example: 'SomeUser123' })
  author: string;
}

export class GetAllPostsDto {
  @ApiProperty({ type: 'number', example: 1 })
  id: number;

  @ApiProperty({ type: 'string', example: 'My post' })
  text: string;

  @ApiProperty({ type: 'string', example: 'SomeUser321' })
  author: string;

  @ApiProperty({
    type: 'object',
    isArray: true,
    example: {
      id: 1,
      text: 'Good luck',
      author: 'Dmytro3',
    },
  })
  comments: CommentInfoDto;
}
