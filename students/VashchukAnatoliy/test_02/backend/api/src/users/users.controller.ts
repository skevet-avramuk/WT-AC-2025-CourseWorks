@Get(':id/followers')
getFollowers(
  @Param('id') userId: string,
  @Query() query: FollowersQueryDto,
) {
  return this.usersService.getFollowers(userId, query.cursor, query.limit);
}

@Get(':id/following')
getFollowing(
  @Param('id') userId: string,
  @Query() query: FollowersQueryDto,
) {
  return this.usersService.getFollowing(userId, query.cursor, query.limit);
}
