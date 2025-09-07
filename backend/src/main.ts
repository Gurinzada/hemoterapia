import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { User, UserRole } from './users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    methods: ["GET", "POST", "PATCH", "OPTIONS", "PUT", "DELETE"],
    origin: "*",
    allowedHeaders: [
      "Authorization",
      "Content-Type",
      "Accept",
      "Origin",
      "X-Requested-With"
    ],
    credentials: true
  });

  app.setGlobalPrefix("/api");

  const dataSource = app.get(DataSource);
  const userRepo = dataSource.getRepository(User);

  async function hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  const users = [
    {
      userName: 'Admin',
      email: 'augustoinacio243@gmail.com',
      password: 'Fodasse123?',
      role: UserRole.MEGA,
    },
    {
      userName: 'Ronier',
      email: 'ronierdasilva@yahoo.com.br',
      password: 'Nuvenzinha123?',
      role: UserRole.ADMIN,
    },
  ];

  for (const u of users) {
    const exists = await userRepo.findOne({ where: { email: u.email } });
    if (!exists) {
      const hashed = await hashPassword(u.password);
      const user = userRepo.create({ ...u, password: hashed });
      await userRepo.save(user);
      console.log(`Seeded user: ${u.email} (${u.role})`);
    } else {
      console.log(`User already exists: ${u.email}`);
    }
  }

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Backend running on port ${process.env.PORT ?? 3000}`);
}

void bootstrap();
