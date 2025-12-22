import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(cors());

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Server started on http://localhost:${port}`);
}
void bootstrap();
