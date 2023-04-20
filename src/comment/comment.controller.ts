import {
  Body,
  Controller,
  Delete,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserInfo } from '../common/decorators/userDecorator';
import { CommentService } from './comment.service';
import { AccessAuthGuard } from '../user/guards/accessAuth.guard';
import { ApiBody, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CreateCommentDto } from './dto/createComment.dto';
import { DeleteCommentDto } from './dto/deleteComment.dto';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(@Inject(CommentService) private commentService: CommentService) {}

  @UseGuards(AccessAuthGuard)
  @ApiOperation({ summary: 'Create comment' })
  @ApiBody({ type: CreateCommentDto })
  @ApiSecurity('access_token')
  @Post('')
  async createComment(@UserInfo() user, @Body() body: CreateCommentDto) {
    return await this.commentService.createComment(user, body);
  }

  @UseGuards(AccessAuthGuard)
  @ApiOperation({ summary: 'Delete comment' })
  @ApiBody({ type: DeleteCommentDto })
  @ApiSecurity('access_token')
  @Delete('')
  async deleteComment(@UserInfo() user, @Body() body: DeleteCommentDto) {
    return await this.commentService.deleteComment(user.id, body);
  }
}
