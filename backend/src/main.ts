import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from "dotenv";
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    methods: ["GET", "POST", "PATCH", "OPTIONS", "PUT"],
    origin: "*",
    allowedHeaders: [
      "Authorization",
      "Content-Type",
      "Accept",
      "Origin",
      "X-Requested-With"
    ],
    credentials: true
  })

  app.setGlobalPrefix("/api");

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
