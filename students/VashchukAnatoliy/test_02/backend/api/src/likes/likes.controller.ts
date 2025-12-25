import { Controller, Post, Delete, Param, UseGuards, HttpCode, Req } from '@nestjs/common';

import { LikesService } from './likes.service';
import { LikePostParams } from './dto/like-post.params';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequireActions } from '../common/decorators/require-actions.decorator';
import { Action } from '../common/enums/action.enum';
import type { AuthRequest } from '../common/types/auth-request.type';

@Controller('likes')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post(':postId')
  @RequireActions(Action.LIKE)
  likePost(@Param() params: LikePostParams, @Req() req: AuthRequest) {
    return this.likesService.likePost(req.user.id, params.postId);
  }

  @Delete(':postId')
  @RequireActions(Action.UNLIKE)
  @HttpCode(204)
  async unlikePost(@Param() params: LikePostParams, @Req() req: AuthRequest) {
    await this.likesService.unlikePost(req.user.id, params.postId);
  }
}
