import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BlogPost } from '../database/entities/post.entity';
import { User } from '../database/entities/user.entity';
import { Comment } from '../database/entities/comment.entity';
import { CreatePostDto } from './dto/createPost.dto';
import { RefreshTokenUserInfoDto } from '../user/dto/refreshTokenUserInfo.dto';
import { handleErrors } from '../common/exceptionHandlers/exceptionHandler';

@Injectable()
export class PostService {
  constructor(@Inject(DataSource) private dataSource: DataSource) {}

  async getPosts(id: number) {
    try {
      let condition = '1=1';
      if (id) {
        condition = `blog_post.id=${id} AND ${condition}`;
      }
      return await this.dataSource
        .createQueryBuilder()
        .select([
          "blog_post.id, blog_post.text, user.nickname as author, array_agg(JSON_BUILD_OBJECT('id', comment.id, 'text', comment.text, 'author', comment.author)) comments",
        ])
        .from(BlogPost, 'blog_post')
        .where(condition)
        .innerJoin(User, 'user', 'blog_post.authorId=user.id')
        .leftJoin(
          (sub) =>
            sub
              .select([
                'comment.postId AS postId, comment.id as id, comment.text as text, user.nickname AS author',
              ])
              .from(Comment, 'comment')
              .leftJoin(User, 'user', 'user.id=comment.authorId'),
          'comment',
          'comment.postId=blog_post.id',
        )
        .groupBy('blog_post.id, user.nickname')
        .execute();
    } catch (e) {
      handleErrors(e);
    }
  }

  async createPost(user: RefreshTokenUserInfoDto, body: CreatePostDto) {
    try {
      return new BlogPost(
        (
          await this.dataSource
            .createQueryBuilder()
            .insert()
            .into(BlogPost)
            .values({ text: body.text, author: () => `${user.id}` })
            .returning('*')
            .execute()
        ).raw[0],
      );
    } catch (e) {
      handleErrors(e);
    }
  }

  async deletePost(authorId: string, id: number) {
    try {
      return await this.dataSource
        .createQueryBuilder()
        .delete()
        .from(BlogPost)
        .where({ author: authorId, id: id })
        .execute();
    } catch (e) {
      handleErrors(e);
    }
  }
}
