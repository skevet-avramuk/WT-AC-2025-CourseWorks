import { Controller, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequireActions } from '../common/decorators/require-actions.decorator';
import { Action } from '../common/enums/action.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { FollowsService } from './follows.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  // =====================
  // FOLLOW
  // =====================
  @Post(':userId')
  @RequireActions(Action.FOLLOW)
  follow(@Param('userId') targetUserId: string, @CurrentUser('id') userId: string) {
    return this.followsService.followUser(userId, targetUserId);
  }

  // =====================
  // UNFOLLOW
  // =====================
  @Delete(':userId')
  @RequireActions(Action.UNFOLLOW)
  unfollow(@Param('userId') targetUserId: string, @CurrentUser('id') userId: string) {
    return this.followsService.unfollowUser(userId, targetUserId);
  }
}
