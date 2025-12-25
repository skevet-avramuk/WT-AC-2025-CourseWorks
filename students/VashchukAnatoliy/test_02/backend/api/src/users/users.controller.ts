import { Controller, Get, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { FollowersQueryDto } from './dto/followers-query.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id/followers')
  getFollowers(@Param('id') userId: string, @Query() query: FollowersQueryDto) {
    return this.usersService.getFollowers(userId, query.cursor, query.limit);
  }

  @Get(':id/following')
  getFollowing(@Param('id') userId: string, @Query() query: FollowersQueryDto) {
    return this.usersService.getFollowing(userId, query.cursor, query.limit);
  }
}
