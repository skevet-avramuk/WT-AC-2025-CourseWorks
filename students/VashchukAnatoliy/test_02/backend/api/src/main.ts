import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';

async function bootstrap() {
  // Загружаем .env до старта приложения
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(cors());

  // ✅ ГЛОБАЛЬНАЯ ВАЛИДАЦИЯ DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // удаляет лишние поля
      forbidNonWhitelisted: true, // ошибка, если передали лишние поля
      transform: true, // DTO -> class
    }),
  );

  // (опционально, но удобно)
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Server started on http://localhost:${port}`);
}
void bootstrap();
