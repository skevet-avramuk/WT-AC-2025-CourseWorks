import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { RepliesModule } from './replies/replies.module';
import { FollowsModule } from './follows/follows.module'; // ✅ ДОБАВИЛИ
import { PrismaModule } from './prisma/prisma.module';
import { LikesModule } from './likes/likes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule, // 👈 один раз глобально
    AuthModule,
    UsersModule,
    PostsModule,
    RepliesModule,
    FollowsModule,
    LikesModule,
  ],
})
export class AppModule {}
