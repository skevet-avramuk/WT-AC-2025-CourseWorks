import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Post } from '../../generated/prisma';
import { PostOwnershipPolicy } from 'src/common/policies/post-ownership.policy';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(authorId: string, text: string): Promise<Post> {
    return this.prisma.post.create({
      data: {
        text,
        authorId,
        status: 'active',
      },
    });
  }

  async getPostById(id: string): Promise<Post> {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post || post.deletedAt) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async deletePost(user: { id: string; role: any }, postId: string): Promise<void> {
    const post = await this.getPostById(postId);

    // 🔐 ownership check — НЕ ТРОГАЕМ
    PostOwnershipPolicy.canModifyPost(user, post);

    await this.prisma.post.update({
      where: { id: postId },
      data: {
        deletedAt: new Date(),
        status: 'archived',
      },
    });
  }
  // src/posts/posts.service.ts

  async getFeed(userId: string, cursor?: string, limit = 20) {
    const follows = await this.prisma.follow.findMany({
      where: { followerId: userId },
      select: { targetId: true },
    });

    const authorIds = [userId, ...follows.map((f) => f.targetId)];

    const posts = await this.prisma.post.findMany({
      where: {
        authorId: { in: authorIds },
        replyToPostId: null,
        deletedAt: null,
        isHidden: false,
        status: 'active',
      },
      include: {
        author: true,
        _count: {
          select: {
            likes: true,
            replies: true,
          },
        },
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
    });

    let nextCursor: string | null = null;

    if (posts.length > limit) {
      const nextItem = posts.pop();
      nextCursor = nextItem!.id;
    }

    return {
      items: posts,
      nextCursor,
    };
  }
}
