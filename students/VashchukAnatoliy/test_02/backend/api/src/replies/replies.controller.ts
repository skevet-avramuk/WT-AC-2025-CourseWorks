// replies/replies.controller.ts
import { Controller, Post, Get, Param, Body, UseGuards, Query } from '@nestjs/common';

import { RepliesService } from './replies.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateReplyDto } from './dto/create-reply.dto';
import { RepliesQueryDto } from './dto/replies-query.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('posts/:postId/replies')
export class RepliesController {
  constructor(private readonly repliesService: RepliesService) {}

  @Post()
  createReply(
    @Param('postId') postId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateReplyDto,
  ) {
    return this.repliesService.createReply(postId, userId, dto);
  }

  @Get()
  getReplies(@Param('postId') postId: string, @Query() query: RepliesQueryDto) {
    return this.repliesService.getReplies(postId, query.cursor, query.limit);
  }
}
