import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST,
      port: Number(process.env.PORT_DATABASE),
      username: process.env.DB_NAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [],
      synchronize: true,
      timezone: 'Z',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
