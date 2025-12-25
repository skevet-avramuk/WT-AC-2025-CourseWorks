import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post as HttpPost,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequireActions } from '../common/decorators/require-actions.decorator';
import { Action } from '../common/enums/action.enum';
import type { AuthRequest } from '../common/types/auth-request.type';
import { FeedQueryDto } from './dto/feed-query.dto';

@Controller('posts')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @HttpPost()
  @RequireActions(Action.CREATE_POST)
  async createPost(@Req() req: AuthRequest, @Body() dto: CreatePostDto) {
    return this.postsService.createPost(req.user.id, dto.text);
  }

  @Get(':id')
  @RequireActions(Action.VIEW_POST)
  async getPost(@Param('id') id: string) {
    return this.postsService.getPostById(id);
  }

  @Delete(':id')
  @RequireActions(Action.DELETE_POST)
  async deletePost(@Req() req: AuthRequest, @Param('id') id: string) {
    await this.postsService.deletePost(req.user, id);
    return { success: true };
  }

  @Get()
  @RequireActions(Action.VIEW_FEED)
  async getFeed(@Req() req: AuthRequest, @Query() query: FeedQueryDto) {
    return this.postsService.getFeed(req.user.id, query.cursor, query.limit);
  }
}
