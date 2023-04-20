import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RefreshTokenUserInfoDto } from '../user/dto/refreshTokenUserInfo.dto';
import { CreateCommentDto } from './dto/createComment.dto';
import { DataSource } from 'typeorm';
import { Comment } from '../database/entities/comment.entity';
import { handleErrors } from '../common/exceptionHandlers/exceptionHandler';
import { DeleteCommentDto } from './dto/deleteComment.dto';
import { BlogPost } from '../database/entities/post.entity';

@Injectable()
export class CommentService {
  constructor(@Inject(DataSource) private dataSource: DataSource) {}

  async createComment(user: RefreshTokenUserInfoDto, body: CreateCommentDto) {
    try {
      const post = await this.dataSource
        .createQueryBuilder()
        .select('*')
        .from(BlogPost, 'blog_post')
        .where({ id: body.postId })
        .getRawOne();
      if (!post) {
        throw new NotFoundException('No such post');
      }
      return new Comment(
        (
          await this.dataSource
            .createQueryBuilder()
            .insert()
            .into(Comment)
            .values({
              text: body.text,
              post: () => `${body.postId}`,
              author: () => `${user.id}`,
            })
            .returning('*')
            .execute()
        ).raw[0],
      );
    } catch (e) {
      handleErrors(e);
    }
  }

  async deleteComment(authorId: string, body: DeleteCommentDto) {
    try {
      await this.dataSource
        .createQueryBuilder()
        .delete()
        .from(Comment)
        .where({ id: body.id, author: authorId, post: body.postId })
        .execute();
    } catch (e) {
      handleErrors(e);
    }
  }
}
