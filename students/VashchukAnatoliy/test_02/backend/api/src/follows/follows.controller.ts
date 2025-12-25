// src/follows/follows.controller.ts
import { Controller, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { FollowsService } from './follows.service';

@UseGuards(JwtAuthGuard)
@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  // =====================
  // FOLLOW
  // =====================
  @Post(':userId')
  follow(@Param('userId') targetUserId: string, @CurrentUser() user: { id: string }) {
    return this.followsService.followUser(user.id, targetUserId);
  }

  // =====================
  // UNFOLLOW
  // =====================
  @Delete(':userId')
  unfollow(@Param('userId') targetUserId: string, @CurrentUser() user: { id: string }) {
    return this.followsService.unfollowUser(user.id, targetUserId);
  }
}
