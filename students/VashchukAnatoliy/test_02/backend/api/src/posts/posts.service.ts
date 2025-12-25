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
}
