import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { GetAllPostsDto } from './dto/getAllPosts.dto';
import { CreatePostDto } from './dto/createPost.dto';
import { PostDto } from './dto/post.dto';
import { AccessAuthGuard } from '../user/guards/accessAuth.guard';
import { UserInfo } from '../common/decorators/userDecorator';
import { ParseToIntPipe } from '../common/pipes/parseToInt.pipe';

@ApiTags('Post')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('post')
export class PostController {
  constructor(@Inject(PostService) private postService: PostService) {}

  @ApiOperation({ summary: 'Get posts' })
  @ApiOkResponse({ type: GetAllPostsDto, isArray: true })
  @Get('')
  async getPosts() {
    return await this.postService.getPosts(undefined);
  }

  @ApiOperation({ summary: 'Get post by id' })
  @ApiOkResponse({ type: GetAllPostsDto, isArray: true })
  @Get(':id')
  async getPostById(@Param('id', ParseToIntPipe) id: number) {
    return await this.postService.getPosts(id);
  }

  @UseGuards(AccessAuthGuard)
  @ApiOperation({ summary: 'Create post' })
  @ApiOkResponse({ type: PostDto })
  @ApiSecurity('access_token')
  @Post('')
  async createPost(@UserInfo() user, @Body() body: CreatePostDto) {
    return await this.postService.createPost(user, body);
  }

  @UseGuards(AccessAuthGuard)
  @ApiOperation({ summary: 'Delete post' })
  @ApiOkResponse({ type: null, isArray: true })
  @ApiSecurity('access_token')
  @Delete(':id')
  async deletePost(@UserInfo() user, @Param('id') id: number) {
    return await this.postService.deletePost(user.id, id);
  }
}
