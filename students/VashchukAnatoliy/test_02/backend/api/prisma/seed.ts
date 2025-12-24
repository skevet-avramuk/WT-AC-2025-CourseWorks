import 'dotenv/config';
import { prisma } from './prisma.client';

async function main() {
  console.log('🌱 Seeding database...');

  // =====================
  // USERS (3+)
  // =====================

  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@test.com',
      passwordHash: 'hashed_admin_password',
      role: 'admin',
    },
  });

  const user1 = await prisma.user.create({
    data: {
      username: 'alice',
      email: 'alice@test.com',
      passwordHash: 'hashed_password_1',
      role: 'user',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'bob',
      email: 'bob@test.com',
      passwordHash: 'hashed_password_2',
      role: 'user',
    },
  });

  console.log('✅ Users created');

  // =====================
  // POSTS
  // =====================

  const post1 = await prisma.post.create({
    data: {
      text: 'Привет, это первый пост в микро-твиттере 👋',
      authorId: user1.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      text: 'Мысли вслух: Prisma довольно удобная штука',
      authorId: user2.id,
    },
  });

  const post3 = await prisma.post.create({
    data: {
      text: 'Админ тоже может писать посты',
      authorId: admin.id,
    },
  });

  console.log('✅ Posts created');

  // =====================
  // REPLIES
  // =====================

  await prisma.post.create({
    data: {
      text: 'Согласен, Prisma топ 🔥',
      authorId: user1.id,
      replyToPostId: post2.id,
    },
  });

  await prisma.post.create({
    data: {
      text: 'Добро пожаловать!',
      authorId: admin.id,
      replyToPostId: post1.id,
    },
  });

  await prisma.post.create({
    data: {
      text: 'Спасибо 🙂',
      authorId: user2.id,
      replyToPostId: post1.id,
    },
  });

  console.log('✅ Replies created');

  // =====================
  // FOLLOWS
  // =====================

  await prisma.follow.create({
    data: {
      followerId: user1.id,
      targetId: user2.id,
    },
  });

  await prisma.follow.create({
    data: {
      followerId: user2.id,
      targetId: user1.id,
    },
  });

  await prisma.follow.create({
    data: {
      followerId: user1.id,
      targetId: admin.id,
    },
  });

  console.log('✅ Follows created');

  // =====================
  // LIKES
  // =====================

  await prisma.like.create({
    data: {
      userId: user1.id,
      postId: post2.id,
    },
  });

  await prisma.like.create({
    data: {
      userId: user2.id,
      postId: post1.id,
    },
  });

  await prisma.like.create({
    data: {
      userId: admin.id,
      postId: post1.id,
    },
  });

  console.log('✅ Likes created');

  // =====================
  // REPORTS
  // =====================

  await prisma.report.create({
    data: {
      postId: post1.id,
      reportedBy: user2.id,
      reason: 'Спам или нерелевантный контент',
      status: 'open',
    },
  });

  await prisma.report.create({
    data: {
      postId: post2.id,
      reportedBy: user1.id,
      reason: 'Оскорбительное содержание',
      status: 'open',
    },
  });

  await prisma.report.create({
    data: {
      postId: post3.id,
      reportedBy: user1.id,
      reason: 'Проверка жалоб',
      status: 'reviewed',
    },
  });

  console.log('✅ Reports created');
  console.log('🌱 Seeding completed successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
