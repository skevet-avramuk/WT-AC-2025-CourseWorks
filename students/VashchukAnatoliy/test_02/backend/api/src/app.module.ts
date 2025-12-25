import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { RepliesModule } from './replies/replies.module';
import { PrismaModule } from './prisma/prisma.module'; // 👈 ВАЖНО

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule, // 👈 один раз
    AuthModule,
    UsersModule,
    PostsModule,
    RepliesModule,
  ],
})
export class AppModule {}
